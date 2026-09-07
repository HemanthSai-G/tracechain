from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class BoundingBox(BaseModel):
    x: int
    y: int
    w: int
    h: int

class BoundingBoxPct(BaseModel):
    left_pct: float
    top_pct: float
    width_pct: float
    height_pct: float

class ImageDimensions(BaseModel):
    width: int
    height: int

class FaceMetrics(BaseModel):
    face_detected: bool
    faces_count: int
    confidence: float
    embedding_dimensions: int
    processing_time_ms: float
    consent_disclaimer: str = "Demo mode: use only faces/content you have permission to process."

class FaceDetectionResponse(BaseModel):
    success: bool
    message: str
    bounding_box: Optional[BoundingBox] = None
    bbox_pct: Optional[BoundingBoxPct] = None
    image_dimensions: Optional[ImageDimensions] = None
    embedding: List[float] = []
    embedding_preview: str = ""
    metrics: FaceMetrics
    warning: Optional[str] = None

class SearchRequest(BaseModel):
    mode: str = "public_web"  # public_web | authorized_demo
    query_text: Optional[str] = None
    embedding: Optional[List[float]] = None
    image_url: Optional[str] = None
    image_base64: Optional[str] = None
    max_results: int = 10

class SearchCandidate(BaseModel):
    candidate_id: str
    source_url: str
    domain: str
    title: str
    snippet: str
    author: Optional[str] = "Web Source"
    timestamp: str
    media_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    face_similarity: Optional[float] = None
    visual_similarity: Optional[float] = None
    candidate_face_similarity: Optional[float] = None
    text_relevance: float
    confidence_score: float
    tracechain_internal_score: float
    status: str  # MATCH | LOW CONFIDENCE | UNCERTAIN
    classification_label: str  # POTENTIAL VISUAL WEB MATCH | AUTHORIZED DEMO SUBJECT MATCH | WEB DISCOVERY RESULT
    category_type: str = "WEB"  # SOCIAL | WEB
    discovered_via: str = "FULL IMAGE"  # FACE CROP + FULL IMAGE | FACE CROP | FULL IMAGE | AUTHORIZED ANCHOR
    face_validation: str = "SKIPPED"  # FACE_MATCH | NO_FACE | SKIPPED | AUTHORIZED_MATCH
    search_mode: str = "PUBLIC_WEB"  # PUBLIC_WEB | AUTHORIZED_DEMO

class SearchDebugInfo(BaseModel):
    search_mode: str = "PUBLIC_WEB"
    serpapi_key_configured: bool = True
    image_received: bool = False
    image_size_bytes: int = 0
    image_mime_type: str = "image/jpeg"
    upload_http_status: int = 200
    upload_success: bool = True
    public_image_url_truncated: str = ""
    google_lens_http_status: int = 200
    exact_matches_count: int = 0
    visual_matches_count: int = 0
    other_sections: List[str] = []
    raw_results_count: int = 0
    valid_candidates_count: int = 0
    filtered_candidates_count: int = 0
    faces_detected_count: int = 0
    face_crop_generated: bool = False
    face_crop_dims: str = "0 x 0"
    full_image_search_status: str = "NOT RUN"
    face_crop_search_status: str = "NOT RUN"
    full_image_results_count: int = 0
    face_crop_results_count: int = 0
    deduplicated_candidates_count: int = 0
    candidates_with_faces_count: int = 0
    candidates_without_faces_count: int = 0
    candidates_embedded_count: int = 0
    authorized_subject_matched: bool = False
    authorized_subject_name: Optional[str] = None
    error_message: Optional[str] = None
    raw_matches_preview: List[Dict[str, Any]] = []

class SearchResponse(BaseModel):
    success: bool
    provider_used: str
    search_method: str
    query_executed: str
    total_candidates: int
    match_classification: str = "NO VERIFIED WEB MATCH FOUND"
    matched_candidate: Optional[SearchCandidate] = None
    candidates: List[SearchCandidate] = []
    execution_steps: List[str] = []
    message: Optional[str] = None
    debug_info: Optional[SearchDebugInfo] = None

class ContentPayload(BaseModel):
    source_url: str
    domain: str
    post_id: str
    author: str
    title: str
    text_caption: str
    media_sha256: str
    timestamp: str
    extra_metadata: Dict[str, Any] = {}

class FingerprintRequest(BaseModel):
    content: ContentPayload

class FingerprintResponse(BaseModel):
    success: bool
    canonical_json: str
    sha256_hash: str
    bytes32_hex: str
    content: ContentPayload

class BlockchainRegisterRequest(BaseModel):
    fingerprint: str
    source_url: str

class BlockchainRegisterResponse(BaseModel):
    success: bool
    tx_hash: str
    block_number: int
    contract_address: str
    network_name: str
    timestamp: int
    submitter: str
    fingerprint: str
    explorer_url: str

class BlockchainVerifyRequest(BaseModel):
    content: ContentPayload
    expected_fingerprint: Optional[str] = None

class BlockchainVerifyResponse(BaseModel):
    verified: bool
    status_label: str
    local_fingerprint: str
    on_chain_fingerprint: Optional[str] = None
    on_chain_timestamp: Optional[int] = None
    on_chain_submitter: Optional[str] = None
    on_chain_source_url: Optional[str] = None
    block_number: Optional[int] = None
    contract_address: str
    network_name: str
    match_details: Dict[str, Any] = {}

class TamperTestRequest(BaseModel):
    original_content: ContentPayload
    tampered_field: str = "text_caption"
    tamper_value: Optional[str] = " [MODIFIED/TAMPERED CONTENT]"

class TamperTestResponse(BaseModel):
    tamper_detected: bool
    original_fingerprint: str
    tampered_fingerprint: str
    original_content: ContentPayload
    tampered_content: ContentPayload
    verification_status: str
    explanation: str

class HealthResponse(BaseModel):
    status: str
    version: str
    blockchain_connected: bool
    search_provider: str
    contract_address: str
