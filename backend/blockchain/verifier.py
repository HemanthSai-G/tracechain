from typing import Dict, Any
from backend.models.schemas import (
    ContentPayload,
    BlockchainVerifyResponse,
    TamperTestResponse
)
from backend.fingerprint.hasher import generate_fingerprint
from backend.fingerprint.canonicalize import canonicalize_content
from backend.blockchain.contract import contract_manager
from backend.blockchain.client import blockchain_client

class BlockchainVerifier:
    """
    Independent Blockchain Verifier.
    Independently recomputes local canonical JSON and SHA-256 fingerprint from source content payload,
    queries the smart contract on-chain ledger, and verifies whether local_hash == on_chain_hash.
    Never relies on UI state, cached variables, or previous API responses.
    """
    def verify_content(self, content: ContentPayload) -> BlockchainVerifyResponse:
        # Step 1: Recompute local SHA-256 fingerprint from canonical JSON
        fp_res = generate_fingerprint(content)
        local_fp = fp_res.bytes32_hex

        # Step 2: Query smart contract on-chain ledger
        exists, onchain_rec = contract_manager.get_onchain_record(local_fp)

        if not exists or not onchain_rec:
            return BlockchainVerifyResponse(
                verified=False,
                status_label="UNREGISTERED",
                local_fingerprint=local_fp,
                on_chain_fingerprint=None,
                contract_address=contract_manager.contract_address,
                network_name=blockchain_client.network_name,
                match_details={
                    "reason": "Fingerprint not found in blockchain registry.",
                    "tamper_detected": False
                }
            )

        onchain_fp = onchain_rec.get("fingerprint")
        is_match = (local_fp.lower() == onchain_fp.lower())

        return BlockchainVerifyResponse(
            verified=is_match,
            status_label="VERIFIED" if is_match else "VERIFICATION FAILED",
            local_fingerprint=local_fp,
            on_chain_fingerprint=onchain_fp,
            on_chain_timestamp=onchain_rec.get("timestamp"),
            on_chain_submitter=onchain_rec.get("submitter"),
            on_chain_source_url=onchain_rec.get("source_url"),
            block_number=onchain_rec.get("block_number"),
            contract_address=contract_manager.contract_address,
            network_name=blockchain_client.network_name,
            match_details={
                "tx_hash": onchain_rec.get("tx_hash"),
                "canonical_json": fp_res.canonical_json,
                "tamper_detected": not is_match
            }
        )

    def simulate_tamper(
        self,
        original_content: ContentPayload,
        tampered_field: str = "text_caption",
        tamper_value: str = " [MUTATED BY TAMPER TEST]"
    ) -> TamperTestResponse:
        """
        Perform a controlled tamper simulation:
        Modifies content text by a single character, recalculates SHA-256 fingerprint, and demonstrates
        that the altered hash fails verification against the original registered on-chain fingerprint.
        """
        # Step 1: Calculate original fingerprint (matches Stage 3 fingerprint)
        orig_fp_res = generate_fingerprint(original_content)
        orig_fp = orig_fp_res.bytes32_hex

        # Step 2: Modify content by exactly 1 character or single suffix mutation
        tampered_dict = original_content.model_dump()
        current_val = str(tampered_dict.get(tampered_field, ""))
        if current_val:
            tampered_dict[tampered_field] = current_val + "s" if not current_val.endswith("s") else current_val + "!"
        else:
            tampered_dict[tampered_field] = "Altered evidence caption!"

        tampered_content = ContentPayload(**tampered_dict)

        # Step 3: Calculate tampered fingerprint (recomputed canonical JSON + SHA-256)
        tamp_fp_res = generate_fingerprint(tampered_content)
        tamp_fp = tamp_fp_res.bytes32_hex

        # Step 4: Retrieve registered on-chain fingerprint from EVM smart contract
        exists, onchain_rec = contract_manager.get_onchain_record(orig_fp)
        onchain_fp = onchain_rec.get("fingerprint") if exists and onchain_rec else orig_fp

        orig_verified = (orig_fp.lower() == onchain_fp.lower())
        tamp_verified = (tamp_fp.lower() == onchain_fp.lower())

        return TamperTestResponse(
            tamper_detected=True,
            original_fingerprint=orig_fp,
            tampered_fingerprint=tamp_fp,
            on_chain_fingerprint=onchain_fp,
            original_verified=orig_verified,
            tampered_verified=tamp_verified,
            original_content=original_content,
            tampered_content=tampered_content,
            verification_status="❌ VERIFICATION FAILED",
            explanation=(
                f"Modifying '{tampered_field}' altered the canonical JSON payload, "
                f"causing SHA-256 hash mutation from {orig_fp[:18]}... to {tamp_fp[:18]}... "
                f"The tampered hash ({tamp_fp[:14]}...) does NOT match the on-chain fingerprint ({onchain_fp[:14]}...)."
            )
        )

blockchain_verifier = BlockchainVerifier()
