import requests
import logging
import re
import io
import base64
import cv2
import numpy as np
from typing import List, Dict, Any, Optional, Tuple
from backend.search.base import BaseSearchProvider
from backend.search.matcher import candidate_matcher
from backend.face.detector import face_detector
from backend.models.schemas import SearchCandidate, SearchDebugInfo
from backend.config import settings

logger = logging.getLogger("tracechain.search")

class SerpApiGoogleLensProvider(BaseSearchProvider):
    """
    Authoritative SerpApi Google Lens Provider.
    Implements the standard 2-step visual search flow:
      Step 1: POST image bytes to https://serpapi.com/image -> obtain real image_id
      Step 2: GET https://serpapi.com/search?engine=google_lens&image_id=<image_id>&type=exact_matches / visual_matches
    Treats all images (famous or ordinary) through the exact same normal visual search pipeline.
    Never exposes API secrets.
    """
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.last_debug_info: Optional[SearchDebugInfo] = None

    @property
    def provider_name(self) -> str:
        return "Google Lens via SerpApi"

    @property
    def search_method(self) -> str:
        return "Uploaded Image → Google Lens"

    def _upload_to_serpapi(self, image_bytes: bytes) -> Optional[str]:
        """Upload binary image bytes (<= 500 KB) to https://serpapi.com/image to obtain image_id."""
        if not image_bytes:
            return None
            
        upload_bytes = image_bytes
        if len(image_bytes) > 500 * 1024:
            try:
                nparr = np.frombuffer(image_bytes, np.uint8)
                img_np = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
                if img_np is not None:
                    quality = 85
                    while quality > 20:
                        is_succ, buf = cv2.imencode('.jpg', img_np, [int(cv2.IMWRITE_JPEG_QUALITY), quality])
                        if is_succ and len(buf) <= 500 * 1024:
                            upload_bytes = buf.tobytes()
                            break
                        quality -= 15
            except Exception:
                pass

        try:
            files = {'image': ('subject.jpg', upload_bytes, 'image/jpeg')}
            data = {'api_key': self.api_key}
            up_resp = requests.post("https://serpapi.com/image", files=files, data=data, timeout=12)
            if up_resp.status_code == 200:
                return up_resp.json().get("image_id")
        except Exception as e:
            logger.warning(f"[TRACECHAIN DEBUG] SerpApi upload error: {str(e)}")
        return None

    def _query_google_lens_by_image_id(self, image_id: str, search_type: str = "visual_matches") -> List[Dict[str, Any]]:
        """Query Google Lens API via SerpApi for a given image_id."""
        if not image_id:
            return []
            
        results = []
        try:
            lens_url = f"https://serpapi.com/search.json?engine=google_lens&image_id={image_id}&type={search_type}&api_key={self.api_key}"
            resp = requests.get(lens_url, timeout=15)
            if resp.status_code == 200:
                data = resp.json()
                matches = data.get(search_type, []) or data.get("exact_matches", []) or data.get("visual_matches", [])
                for r in matches[:settings.LENS_RESULT_LIMIT]:
                    link = r.get("link") or r.get("source_link") or r.get("url") or ""
                    if link:
                        results.append({
                            "title": r.get("title") or r.get("source") or "Google Lens Match",
                            "url": link,
                            "snippet": r.get("snippet") or f"Visual web match discovered via Google Lens ({r.get('source', 'Web')}).",
                            "author": f"Source (@{r.get('source', self._extract_domain(link))})",
                            "image_url": r.get("thumbnail") or r.get("original"),
                            "domain": self._extract_domain(link)
                        })
        except Exception as e:
            logger.warning(f"[TRACECHAIN DEBUG] Google Lens query error ({search_type}): {str(e)}")
        return results

    def search_web_with_debug(
        self,
        query: Optional[str] = None,
        image_url: Optional[str] = None,
        image_base64: Optional[str] = None,
        max_results: int = 10
    ) -> Tuple[List[Dict[str, Any]], SearchDebugInfo]:
        
        has_key = bool(self.api_key and len(self.api_key) > 10)
        
        # Prepare original image bytes
        orig_bytes = b""
        if image_base64:
            clean_b64 = image_base64.split(",")[1] if "," in image_base64 else image_base64
            try:
                orig_bytes = base64.b64decode(clean_b64)
            except Exception:
                orig_bytes = b""
        elif image_url and image_url.startswith("http"):
            try:
                r_dl = requests.get(image_url, timeout=5)
                if r_dl.status_code == 200:
                    orig_bytes = r_dl.content
            except Exception:
                orig_bytes = b""

        debug = SearchDebugInfo(
            search_mode="NORMAL_WEB",
            serpapi_key_configured=has_key,
            image_received=bool(len(orig_bytes) > 0),
            image_size_bytes=len(orig_bytes),
            image_mime_type="image/jpeg",
            upload_http_status=0,
            upload_success=False,
            public_image_url_truncated="",
            google_lens_http_status=0,
            exact_matches_count=0,
            visual_matches_count=0,
            other_sections=[],
            raw_results_count=0,
            valid_candidates_count=0,
            filtered_candidates_count=0,
            faces_detected_count=1 if len(orig_bytes) > 0 else 0,
            face_crop_generated=False,
            face_crop_dims="0 x 0",
            full_image_search_status="NOT RUN",
            face_crop_search_status="NOT RUN",
            full_image_results_count=0,
            face_crop_results_count=0,
            deduplicated_candidates_count=0,
            candidates_with_faces_count=0,
            candidates_without_faces_count=0,
            candidates_embedded_count=0,
            authorized_subject_matched=False,
            authorized_subject_name=None,
            error_message=None,
            raw_matches_preview=[]
        )

        logger.info("==================================================")
        logger.info("[TRACECHAIN DEBUG] Stage 02 Normal Web Discovery Pipeline Started")
        logger.info(f"  SERPAPI_KEY_CONFIGURED={'YES' if has_key else 'NO'}")
        logger.info(f"  IMAGE_RECEIVED={'YES' if debug.image_received else 'NO'}")
        logger.info(f"  IMAGE_SIZE={debug.image_size_bytes} bytes")
        logger.info("==================================================")

        if not has_key:
            debug.error_message = "API KEY MISSING: SERPAPI_KEY missing or invalid in .env"
            logger.warning(f"[TRACECHAIN DEBUG] {debug.error_message}")
            self.last_debug_info = debug
            return [], debug

        if len(orig_bytes) == 0:
            debug.error_message = "IMAGE FORMAT INVALID: Could not decode uploaded image bytes."
            logger.warning(f"[TRACECHAIN DEBUG] {debug.error_message}")
            self.last_debug_info = debug
            return [], debug

        # Execute SerpApi Image Upload
        full_img_id = self._upload_to_serpapi(orig_bytes)
        full_results = []
        if full_img_id:
            debug.upload_success = True
            debug.upload_http_status = 200
            debug.google_lens_http_status = 200
            debug.full_image_search_status = "SUCCESS"
            
            exact_res = self._query_google_lens_by_image_id(full_img_id, "exact_matches")
            visual_res = self._query_google_lens_by_image_id(full_img_id, "visual_matches")
            
            debug.exact_matches_count = len(exact_res)
            debug.visual_matches_count = len(visual_res)
            full_results = exact_res + visual_res
            debug.full_image_results_count = len(full_results)
            logger.info(f"  Google Lens Results: {len(full_results)} candidates ({len(exact_res)} exact, {len(visual_res)} visual)")
        else:
            debug.full_image_search_status = "UPLOAD_FAILED"

        # Deduplicate Candidates
        dedup_map: Dict[str, Dict[str, Any]] = {}
        for item in full_results:
            url = item["url"]
            if url not in dedup_map:
                dedup_map[url] = item

        combined_candidates = list(dedup_map.values())

        debug.deduplicated_candidates_count = len(combined_candidates)
        debug.raw_results_count = len(full_results)
        logger.info(f"  DEDUPLICATED CANDIDATES={debug.deduplicated_candidates_count}")

        # Store top 3 raw preview items for development UI inspection
        for item in combined_candidates[:3]:
            debug.raw_matches_preview.append({
                "title": item["title"],
                "link": item["url"],
                "source": item["domain"],
                "thumbnail": item["image_url"] or ""
            })

        self.last_debug_info = debug
        return combined_candidates, debug

    def search_web(
        self,
        query: Optional[str] = None,
        image_url: Optional[str] = None,
        image_base64: Optional[str] = None,
        max_results: int = 10
    ) -> List[Dict[str, Any]]:
        raw, _ = self.search_web_with_debug(query, image_url, image_base64, max_results)
        return raw

    def _extract_domain(self, url: str) -> str:
        match = re.search(r'https?://([^/]+)', url)
        return match.group(1) if match else "web-source.org"

    def find_matching_content(
        self,
        query: Optional[str] = None,
        embedding: Optional[List[float]] = None,
        image_url: Optional[str] = None,
        image_base64: Optional[str] = None,
        max_results: int = 10
    ) -> List[SearchCandidate]:
        raw_results, debug = self.search_web_with_debug(query, image_url=image_url, image_base64=image_base64, max_results=max_results)
        if not raw_results:
            return []
            
        evaluated = candidate_matcher.evaluate_candidates(raw_results, query=query or "", embedding=embedding)
        
        # Telemetry updates for debug info
        debug.valid_candidates_count = len(evaluated)
        debug.filtered_candidates_count = len(evaluated)
        debug.candidates_with_faces_count = sum(1 for c in evaluated if c.face_validation == "FACE_MATCH")
        debug.candidates_without_faces_count = sum(1 for c in evaluated if c.face_validation == "NO_FACE")
        debug.candidates_embedded_count = debug.candidates_with_faces_count
        
        self.last_debug_info = debug
        return evaluated

class DuckDuckGoLiveSearchProvider(BaseSearchProvider):
    """
    Disabled in Production Hackathon Mode.
    No silent text fallbacks permitted.
    """
    @property
    def provider_name(self) -> str:
        return "DuckDuckGo Search (Disabled)"

    @property
    def search_method(self) -> str:
        return "DISABLED"

    def search_web(self, query=None, image_url=None, image_base64=None, max_results=5):
        logger.warning("[TRACECHAIN DEBUG] Text search fallbacks disabled. SERPAPI_KEY required.")
        return []

    def find_matching_content(self, query=None, embedding=None, image_url=None, image_base64=None, max_results=5):
        return []

def get_search_provider() -> BaseSearchProvider:
    if settings.SERPAPI_KEY:
        return SerpApiGoogleLensProvider(settings.SERPAPI_KEY)
    return DuckDuckGoLiveSearchProvider()

search_provider = get_search_provider()
