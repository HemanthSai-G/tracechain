import os
import io
import logging
import requests
import re
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List, Dict, Any

from backend.config import settings
from backend.models.schemas import (
    FaceDetectionResponse,
    BoundingBox,
    BoundingBoxPct,
    ImageDimensions,
    FaceMetrics,
    SearchRequest,
    SearchResponse,
    SearchCandidate,
    SearchDebugInfo,
    FingerprintRequest,
    FingerprintResponse,
    BlockchainRegisterRequest,
    BlockchainRegisterResponse,
    BlockchainVerifyRequest,
    BlockchainVerifyResponse,
    TamperTestRequest,
    TamperTestResponse,
    HealthResponse,
    ContentPayload
)
from backend.face.detector import face_detector
from backend.face.encoder import face_encoder
from backend.search.provider import search_provider, SerpApiGoogleLensProvider
from backend.fingerprint.hasher import generate_fingerprint
from backend.blockchain.contract import contract_manager
from backend.blockchain.verifier import blockchain_verifier
from backend.blockchain.client import blockchain_client

logger = logging.getLogger("tracechain")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description=f"{settings.TAGLINE} — HH Goa 2026 Hackathon Core API",
    version=settings.VERSION
)

# Enable CORS for local React Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get(f"{settings.API_PREFIX}/health", response_model=HealthResponse)
def health_check():
    return HealthResponse(
        status="ONLINE",
        version=settings.VERSION,
        blockchain_connected=blockchain_client.is_connected(),
        search_provider=search_provider.provider_name,
        contract_address=contract_manager.contract_address
    )

@app.post(f"{settings.API_PREFIX}/face/detect", response_model=FaceDetectionResponse)
async def detect_and_encode_face(
    file: UploadFile = File(...)
):
    """
    Stage 01: Process uploaded image file.
    Decodes image, detects face(s), calculates exact bounding box coordinates & relative percentages,
    and computes 512-d normalized visual feature vector.
    """
    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Uploaded image file is empty.")

    logger.info(f"[Stage 1] Received image: filename='{file.filename}', content_type='{file.content_type}', size={len(contents)} bytes")

    res = face_detector.detect_face(contents)
    
    # Check detection success
    if not res.get("success"):
        return FaceDetectionResponse(
            success=False,
            message=res.get("error", "No face detected in uploaded image."),
            bounding_box=None,
            bbox_pct=None,
            image_dimensions=None,
            embedding=[],
            embedding_preview="",
            metrics=FaceMetrics(
                face_detected=False,
                faces_count=0,
                confidence=0.0,
                embedding_dimensions=0,
                processing_time_ms=res.get("processing_time_ms", 0.0)
            ),
            warning=None
        )

    # Face(s) detected: compute bounding box coordinates & percentages
    face_crop = res.get("face_crop")
    embedding = face_encoder.generate_embedding(face_crop)
    
    bbox_dict = res.get("bounding_box")
    img_dims_dict = res.get("image_dimensions")
    
    bbox = BoundingBox(**bbox_dict) if bbox_dict else None
    img_dims = ImageDimensions(**img_dims_dict) if img_dims_dict else None
    
    bbox_pct = None
    if bbox and img_dims and img_dims.width > 0 and img_dims.height > 0:
        bbox_pct = BoundingBoxPct(
            left_pct=round((bbox.x / img_dims.width) * 100, 2),
            top_pct=round((bbox.y / img_dims.height) * 100, 2),
            width_pct=round((bbox.w / img_dims.width) * 100, 2),
            height_pct=round((bbox.h / img_dims.height) * 100, 2)
        )

    emb_preview = f"[{', '.join([str(v) for v in embedding[:4]])}, ... ({len(embedding)} dimensions)]"
    
    msg = f"FACE DETECTED: {res.get('faces_count')} face(s) found. 512-d feature vector generated."
    if res.get("warning"):
        msg += f" ({res.get('warning')})"

    return FaceDetectionResponse(
        success=True,
        message=msg,
        bounding_box=bbox,
        bbox_pct=bbox_pct,
        image_dimensions=img_dims,
        embedding=embedding,
        embedding_preview=emb_preview,
        metrics=FaceMetrics(
            face_detected=True,
            faces_count=res.get("faces_count", 1),
            confidence=res.get("confidence", 0.95),
            embedding_dimensions=len(embedding),
            processing_time_ms=res.get("processing_time_ms", 0.0)
        ),
        warning=res.get("warning")
    )

@app.post(f"{settings.API_PREFIX}/search", response_model=SearchResponse)
def execute_web_search(request: SearchRequest):
    """
    Stage 02: Perform Genuine Google Lens Web Discovery.
    Executes standard 2-step visual search flow via SerpApi.
    Treats all images through the exact same visual search pipeline.
    """
    logger.info("==================================================")
    logger.info("[Stage 02] Executing Normal Google Lens Web Discovery...")
    logger.info("==================================================")

    query = request.query_text or face_encoder.derive_visual_search_query(None)

    steps = [
        "STAGE 01 FACE FEATURE VECTOR READY",
        "POSTING UPLOADED IMAGE TO SERPAPI IMAGE ENGINE",
        "RETRIEVING EXACT & VISUAL MATCHES FROM GOOGLE LENS",
        "DEDUPLICATING & EVALUATING DISCOVERED WEB SOURCES",
        "MATCH DISCOVERY COMPLETE"
    ]
    
    candidates = []
    debug_info = None

    if isinstance(search_provider, SerpApiGoogleLensProvider):
        candidates = search_provider.find_matching_content(
            query=query,
            embedding=request.embedding,
            image_url=request.image_url,
            image_base64=request.image_base64,
            max_results=request.max_results
        )
        debug_info = search_provider.last_debug_info
    else:
        candidates = search_provider.find_matching_content(
            query=query,
            embedding=request.embedding,
            image_url=request.image_url,
            image_base64=request.image_base64,
            max_results=request.max_results
        )

    matched = candidates[0] if candidates else None

    # Domain Category Classification
    has_social = any(c.category_type == "SOCIAL" for c in candidates)
    if candidates and has_social:
        match_class = "REAL WEB & SOCIAL MATCH FOUND"
    elif candidates:
        match_class = "REAL WEB MATCH FOUND"
    else:
        match_class = "NO VERIFIED WEB MATCH FOUND"

    msg = None
    if not candidates:
        if not settings.SERPAPI_KEY:
            msg = "REAL VISUAL SEARCH UNAVAILABLE. Reason: SERPAPI_KEY missing or invalid in .env"
        else:
            msg = "Google Lens returned zero visual matches for this image."

    return SearchResponse(
        success=len(candidates) > 0,
        provider_used=search_provider.provider_name,
        search_method=search_provider.search_method,
        query_executed=query,
        total_candidates=len(candidates),
        match_classification=match_class,
        matched_candidate=matched,
        candidates=candidates,
        execution_steps=steps,
        message=msg,
        debug_info=debug_info
    )

@app.post(f"{settings.API_PREFIX}/fingerprint", response_model=FingerprintResponse)
def create_content_fingerprint(request: FingerprintRequest):
    """
    Stage 03: Construct deterministic canonical JSON representation and compute SHA-256 fingerprint.
    """
    return generate_fingerprint(request.content)

@app.post(f"{settings.API_PREFIX}/blockchain/register", response_model=BlockchainRegisterResponse)
def register_on_blockchain(request: BlockchainRegisterRequest):
    """
    Stage 04: Anchor SHA-256 fingerprint into EVM smart contract on-chain registry.
    """
    return contract_manager.register_fingerprint(
        fingerprint=request.fingerprint,
        source_url=request.source_url
    )

@app.post(f"{settings.API_PREFIX}/blockchain/verify", response_model=BlockchainVerifyResponse)
def verify_on_blockchain(request: BlockchainVerifyRequest):
    """
    Stage 05: Perform independent verification comparing freshly calculated SHA-256 fingerprint against on-chain ledger.
    """
    return blockchain_verifier.verify_content(request.content)

@app.post(f"{settings.API_PREFIX}/blockchain/tamper-test", response_model=TamperTestResponse)
def test_tamper_simulation(request: TamperTestRequest):
    """
    Stage 06: Demonstrate tamper resistance by modifying a field and showing verification failure.
    """
    return blockchain_verifier.simulate_tamper(
        original_content=request.original_content,
        tampered_field=request.tampered_field,
        tamper_value=request.tamper_value or " [MODIFIED/TAMPERED CONTENT]"
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
