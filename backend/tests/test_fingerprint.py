import pytest
from backend.models.schemas import ContentPayload
from backend.fingerprint.canonicalize import canonicalize_content
from backend.fingerprint.hasher import generate_fingerprint

def test_canonicalize_content_deterministic():
    content = ContentPayload(
        source_url="https://github.com/alexrivera/tracechain",
        domain="github.com",
        post_id="post_101",
        author="Alex Rivera",
        title="TraceChain Canonical Test",
        text_caption="Immutable evidence fingerprint test.",
        media_sha256="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        timestamp="2026-03-15T14:32:00Z"
    )
    
    # Run canonicalization 10 times
    json_results = [canonicalize_content(content) for _ in range(10)]
    
    # All 10 must be 100% identical
    assert len(set(json_results)) == 1
    
    # Timestamp must NOT be in canonical JSON
    assert "timestamp" not in json_results[0]
    assert "Alex Rivera" in json_results[0]

def test_sha256_hash_deterministic():
    content = ContentPayload(
        source_url="https://github.com/alexrivera/tracechain",
        domain="github.com",
        post_id="post_101",
        author="Alex Rivera",
        title="TraceChain Canonical Test",
        text_caption="Immutable evidence fingerprint test.",
        media_sha256="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        timestamp="2026-03-15T14:32:00Z"
    )
    
    hashes = [generate_fingerprint(content).bytes32_hex for _ in range(10)]
    assert len(set(hashes)) == 1
    assert len(hashes[0]) == 66  # 0x + 64 hex characters
    assert hashes[0].startswith("0x")

def test_one_character_modification_changes_hash():
    content_orig = ContentPayload(
        source_url="https://lablab.ai/ai-hackathons/amd-developer-hackathon",
        domain="lablab.ai",
        post_id="post_202",
        author="AMD Hackathon",
        title="AMD Developer Hackathon: ACT III AI Hackathon",
        text_caption="AMD AI Hackathon Project",
        media_sha256="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        timestamp="2026-03-15T14:32:00Z"
    )
    
    content_tamp = ContentPayload(
        source_url="https://lablab.ai/ai-hackathons/amd-developer-hackathon",
        domain="lablab.ai",
        post_id="post_202",
        author="AMD Hackathon",
        title="AMD Developer Hackathon: ACT III AI HackathoX", # 1 character changed
        text_caption="AMD AI Hackathon Project",
        media_sha256="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        timestamp="2026-03-15T14:32:00Z"
    )
    
    hash_orig = generate_fingerprint(content_orig).bytes32_hex
    hash_tamp = generate_fingerprint(content_tamp).bytes32_hex
    
    assert hash_orig != hash_tamp

def test_unicode_content_fingerprint():
    content = ContentPayload(
        source_url="https://example.com/telugu-actor",
        domain="example.com",
        post_id="post_303",
        author="Telugu Cinema Studio",
        title="Prabhas — 🎬 🔥 Cinema Profile",
        text_caption="Special Telugu actor unicode text summary with emojis 🎉",
        media_sha256="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        timestamp="2026-03-15T14:32:00Z"
    )
    
    fp_res = generate_fingerprint(content)
    assert len(fp_res.bytes32_hex) == 66
    assert "Prabhas" in fp_res.canonical_json
