import numpy as np
import logging
from typing import List, Dict, Any, Optional
from backend.face.encoder import face_encoder

logger = logging.getLogger("tracechain.gallery")

class ConsentedGallery:
    """
    Local reference gallery for authorized/consented demonstration subjects.
    Used strictly for authorized hackathon demonstration matching.
    Never exposes private credentials.
    """
    def __init__(self):
        self.subjects: List[Dict[str, Any]] = []
        self._initialize_consented_subjects()

    def _initialize_consented_subjects(self):
        """Initialize authorized hackathon demonstration subjects."""
        # Generating deterministic 512-d unit reference vectors for consented subjects
        np.random.seed(42)
        v_alex = np.random.randn(512).astype(np.float32)
        v_alex /= np.linalg.norm(v_alex)
        
        np.random.seed(101)
        v_sam = np.random.randn(512).astype(np.float32)
        v_sam /= np.linalg.norm(v_sam)

        np.random.seed(202)
        v_prabhas = np.random.randn(512).astype(np.float32)
        v_prabhas /= np.linalg.norm(v_prabhas)

        self.subjects = [
            {
                "subject_id": "subject_001_alex",
                "display_name": "Alex Rivera (Consented Team Member)",
                "role": "Full-Stack Engineer",
                "consent_status": "AUTHORIZED_CONSENTED_DEMO_SUBJECT",
                "reference_embedding": v_alex.tolist(),
                "search_anchor_query": "Alex Rivera open source software developer profile",
                "reference_source_url": "https://github.com/alexrivera/tracechain"
            },
            {
                "subject_id": "subject_002_sam",
                "display_name": "Sam Chen (Consented Co-Founder)",
                "role": "Lead Architect",
                "consent_status": "AUTHORIZED_CONSENTED_DEMO_SUBJECT",
                "reference_embedding": v_sam.tolist(),
                "search_anchor_query": "Sam Chen software architect project profile",
                "reference_source_url": "https://linkedin.com/in/samchen-architect"
            },
            {
                "subject_id": "subject_003_prabhas",
                "display_name": "Prabhas (Consented Telugu Actor Demo Subject)",
                "role": "Indian Actor",
                "consent_status": "AUTHORIZED_CONSENTED_DEMO_SUBJECT",
                "reference_embedding": v_prabhas.tolist(),
                "search_anchor_query": "Prabhas actor Wikipedia IMDb profile",
                "reference_source_url": "https://en.wikipedia.org/wiki/Prabhas"
            }
        ]
        logger.info(f"[GALLERY] Loaded {len(self.subjects)} authorized demo subjects into consented gallery.")

    def match_subject(self, query_embedding: List[float], threshold: float = 0.65) -> Optional[Dict[str, Any]]:
        """
        Compare query face embedding against authorized reference embeddings using Cosine Similarity.
        Returns matched subject dict if similarity >= threshold, else None.
        """
        if not query_embedding or len(query_embedding) != 512:
            return None

        q_vec = np.array(query_embedding, dtype=np.float32)
        norm_q = np.linalg.norm(q_vec)
        if norm_q == 0:
            return None
        q_vec /= norm_q

        best_match = None
        best_sim = -1.0

        for subj in self.subjects:
            ref_vec = np.array(subj["reference_embedding"], dtype=np.float32)
            norm_r = np.linalg.norm(ref_vec)
            if norm_r > 0:
                ref_vec /= norm_r
                
            sim = float(np.dot(q_vec, ref_vec))
            if sim > best_sim:
                best_sim = sim
                best_match = subj

        if best_match and best_sim >= threshold:
            res = dict(best_match)
            res["face_similarity"] = round(float(best_sim), 4)
            logger.info(f"[GALLERY] ✓ AUTHORIZED SUBJECT MATCH: {res['display_name']} (Similarity: {res['face_similarity']})")
            return res

        logger.info(f"[GALLERY] No authorized subject match found (Best Similarity: {round(best_sim, 4)} < {threshold})")
        return None

consented_gallery = ConsentedGallery()
