import pytest
from backend.models.schemas import ContentPayload
from backend.fingerprint.hasher import generate_fingerprint
from backend.blockchain.contract import contract_manager
from backend.blockchain.verifier import blockchain_verifier

def test_blockchain_registration_and_readback():
    content = ContentPayload(
        source_url="https://github.com/alexrivera/tracechain",
        domain="github.com",
        post_id="post_test_001",
        author="Alex Rivera",
        title="TraceChain Smart Contract Verification Test",
        text_caption="Testing round-trip registration and on-chain lookup.",
        media_sha256="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        timestamp="2026-03-15T14:32:00Z"
    )
    
    fp_res = generate_fingerprint(content)
    local_hash = fp_res.bytes32_hex
    
    # 1. Register Fingerprint
    reg_res = contract_manager.register_fingerprint(local_hash, content.source_url)
    assert reg_res.success is True
    assert reg_res.fingerprint.lower() == local_hash.lower()
    
    # 2. Read back from contract manager
    exists, record = contract_manager.get_onchain_record(local_hash)
    assert exists is True
    assert record["fingerprint"].lower() == local_hash.lower()
    
    # 3. Independent Verification
    verify_res = blockchain_verifier.verify_content(content)
    assert verify_res.verified is True
    assert verify_res.status_label == "VERIFIED"
    assert verify_res.local_fingerprint.lower() == verify_res.on_chain_fingerprint.lower()

def test_tamper_simulation_verification_failed():
    content_orig = ContentPayload(
        source_url="https://devpost.com/software/tracechain",
        domain="devpost.com",
        post_id="post_test_002",
        author="TraceChain Team",
        title="TraceChain HackIndia Entry",
        text_caption="Original verified hackathon entry content.",
        media_sha256="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        timestamp="2026-03-15T14:32:00Z"
    )
    
    fp_res = generate_fingerprint(content_orig)
    contract_manager.register_fingerprint(fp_res.bytes32_hex, content_orig.source_url)
    
    # Run tamper simulation
    tamp_res = blockchain_verifier.simulate_tamper(content_orig, tampered_field="text_caption", tamper_value=" [TAMPERED]")
    
    assert tamp_res.tamper_detected is True
    assert tamp_res.verification_status == "❌ VERIFICATION FAILED"
    assert tamp_res.original_fingerprint != tamp_res.tampered_fingerprint
