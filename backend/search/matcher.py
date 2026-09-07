import math
import numpy as np
import requests
import logging
import re
from typing import List, Dict, Any, Optional
from backend.models.schemas import SearchCandidate
from backend.face.encoder import face_encoder
from backend.face.detector import face_detector
from backend.config import settings

logger = logging.getLogger("tracechain.matcher")

SOCIAL_DOMAINS = {
    "instagram.com", "twitter.com", "x.com", "linkedin.com", "facebook.com",
    "devpost.com", "github.com", "youtube.com", "medium.com", "threads.net",
    "reddit.com", "pinterest.com", "tiktok.com", "behance.net"
}

class CandidateMatcher:
    """
    Two-stage candidate matcher and validator.
    Performs candidate thumbnail face detection, face-region feature comparison, deduplication, and honest ranking.
    Penalizes non-face clothing/scenery candidates to ensure face evidence dominates.
    """

    def cosine_similarity(self, vec1: List[float], vec2: List[float]) -> float:
        """Calculate mathematical cosine similarity between two 512-d normalized vectors."""
        if not vec1 or not vec2 or len(vec1) != len(vec2):
            return 0.0
        
        arr1 = np.array(vec1, dtype=np.float32)
        arr2 = np.array(vec2, dtype=np.float32)
        
        dot_product = np.dot(arr1, arr2)
        norm1 = np.linalg.norm(arr1)
        norm2 = np.linalg.norm(arr2)
        
        if norm1 == 0 or norm2 == 0:
            return 0.0
            
        sim = float(dot_product / (norm1 * norm2))
        return round(float(np.clip(sim, 0.0, 1.0)), 4)

    def process_candidate_media_embedding(self, media_url: str) -> Tuple[Optional[List[float]], str]:
        """
        Download candidate image thumbnail and extract 512-d visual face vector.
        Returns (embedding, face_validation_status).
        """
        if not media_url or not media_url.startswith("http"):
            return None, "NO_FACE"
            
        try:
            resp = requests.get(media_url, timeout=3, headers={"User-Agent": "Mozilla/5.0"})
            if resp.status_code == 200 and resp.content:
                det_res = face_detector.detect_face(resp.content)
                if det_res.get("success") and det_res.get("face_crop") is not None:
                    emb = face_encoder.generate_embedding(det_res["face_crop"])
                    return emb, "FACE_MATCH"
                else:
                    return None, "NO_FACE"
        except Exception as e:
            logger.debug(f"Candidate thumbnail face validation skipped ({media_url}): {str(e)}")
        return None, "NO_FACE"

    def evaluate_candidates(
        self,
        candidates_raw: List[Dict[str, Any]],
        query: str = "",
        embedding: Optional[List[float]] = None
    ) -> List[SearchCandidate]:
        """
        Evaluate, validate, and rank candidates returned by two-pass Google Lens searches.
        """
        evaluated = []
        val_limit = settings.CANDIDATE_VALIDATION_LIMIT
        
        for idx, raw in enumerate(candidates_raw):
            title = raw.get("title", f"Discovered Web Result #{idx+1}")
            url = raw.get("url") or raw.get("link") or "https://web-source.org"
            snippet = raw.get("snippet") or raw.get("body") or ""
            domain = raw.get("domain") or self._extract_domain(url)
            media_url = raw.get("image_url") or raw.get("thumbnail") or None
            disc_via = raw.get("discovered_via", "FULL IMAGE")
            
            # 1. Domain Category Classification
            category = "SOCIAL" if any(d in domain.lower() for d in SOCIAL_DOMAINS) else "WEB"
            
            # 2. Candidate Thumbnail Face Detection & Embedding (Limited to top N candidates)
            cand_emb = None
            face_val = "SKIPPED"
            
            if idx < val_limit and media_url:
                cand_emb, face_val = self.process_candidate_media_embedding(media_url)
            
            # 3. Calculate Face Region Cosine Similarity
            cand_face_sim = None
            if embedding and cand_emb:
                cand_face_sim = self.cosine_similarity(embedding, cand_emb)

            # 4. TRACECHAIN INTERNAL RANKING Computation
            # Discovery Source Boost: FACE CROP + FULL IMAGE > FACE CROP > FULL IMAGE
            source_boost = 1.0
            if disc_via == "FACE CROP + FULL IMAGE":
                source_boost = 1.15
            elif disc_via == "FACE CROP":
                source_boost = 1.10
                
            rank_score = max(0.40, 1.0 - (idx * 0.08)) * source_boost
            
            if cand_face_sim is not None:
                # 70% Face Similarity, 20% Lens Rank, 10% Source Quality
                internal_score = round(0.70 * cand_face_sim + 0.20 * rank_score + 0.10 * (1.1 if category == "SOCIAL" else 1.0), 4)
            else:
                # Penalty if candidate has NO FACE (clothing/scenery match)
                penalty = 0.50 if face_val == "NO_FACE" else 0.85
                internal_score = round((0.60 * rank_score + 0.40 * 0.5) * penalty, 4)

            internal_score = float(np.clip(internal_score, 0.05, 0.99))

            # 5. Honest Status Classification Label (Never overclaim identity)
            if cand_face_sim is not None and cand_face_sim >= settings.FACE_MATCH_THRESHOLD:
                status = "MATCH"
                label = "POTENTIAL VISUAL WEB MATCH"
            elif internal_score >= 0.55:
                status = "MATCH"
                label = "WEB DISCOVERY RESULT"
            else:
                status = "LOW CONFIDENCE"
                label = "WEB MATCH (NO FACE IN THUMBNAIL)" if face_val == "NO_FACE" else "WEB DISCOVERY RESULT"

            candidate_obj = SearchCandidate(
                candidate_id=f"cand_goa_{idx+1:03d}",
                source_url=url,
                domain=domain,
                title=title,
                snippet=snippet if snippet else f"Discovered via Google Lens ({disc_via}).",
                author=raw.get("author") or f"Source (@{domain})",
                timestamp=raw.get("timestamp") or "2026-03-15T14:32:00Z",
                media_url=media_url,
                thumbnail_url=media_url,
                face_similarity=cand_face_sim,
                visual_similarity=cand_face_sim,
                candidate_face_similarity=cand_face_sim,
                text_relevance=round(float(rank_score), 4),
                confidence_score=internal_score,
                tracechain_internal_score=internal_score,
                status=status,
                classification_label=label,
                category_type=category,
                discovered_via=disc_via,
                face_validation=face_val
            )
            evaluated.append(candidate_obj)

        # Sort candidates descending by internal score
        evaluated.sort(key=lambda c: c.tracechain_internal_score, reverse=True)
        return evaluated

    def _extract_domain(self, url: str) -> str:
        match = re.search(r'https?://([^/]+)', url)
        return match.group(1) if match else "web-source.org"

candidate_matcher = CandidateMatcher()
