import hashlib
from typing import Tuple, Dict, Any
from backend.models.schemas import ContentPayload, FingerprintResponse
from backend.fingerprint.canonicalize import canonicalize_content

def generate_fingerprint(content: ContentPayload) -> FingerprintResponse:
    """
    Generate SHA-256 fingerprint and bytes32 representation from content.
    """
    canonical_json = canonicalize_content(content)
    
    # Compute SHA-256 over canonical UTF-8 bytes
    sha256_hash = hashlib.sha256(canonical_json.encode('utf-8')).hexdigest()
    bytes32_hex = "0x" + sha256_hash
    
    return FingerprintResponse(
        success=True,
        canonical_json=canonical_json,
        sha256_hash=sha256_hash,
        bytes32_hex=bytes32_hex,
        content=content
    )
