# TRACECHAIN

> **"From Face to Source. From Source to Proof."**  
> HH Goa 2026 Hackathon Flagship Project

---

## 📌 Executive Summary

**TRACECHAIN** is a cryptographic provenance verification platform. It links visual content to discovered web sources and anchors content fingerprints into an EVM blockchain smart contract.

> ⚠️ **IMPORTANT ARCHITECTURAL DISCLAIMER**  
> **THE BLOCKCHAIN DOES NOT PROVE A PERSON'S IDENTITY.**  
> It proves the cryptographic integrity and immutability of the discovered web source evidence.

---

## 🛠️ System Architecture & Final Pipeline

```
[01 FACE SCAN] ──► [02 GOOGLE LENS SEARCH] ──► [03 CANONICAL FINGERPRINT] ──► [04 EVM BLOCKCHAIN] ──► [INDEPENDENT VERIFICATION]
   OpenCV DNN          SerpApi Google Lens           Deterministic UTF-8            TraceChainRegistry         Recomputed SHA-256 vs
   YuNet ONNX          Visual Discovery              JSON & SHA-256 Digest          Solidity bytes32           On-Chain State Match
```

### Stage 1: Face Scan & Neural Feature Extraction
- **Face Detector**: OpenCV YuNet ONNX Deep Learning Neural Network (`face_detection_yunet_2023mar.onnx`) with Haar Cascade multi-scale fallback.
- **Visual Encoder**: Generates a 512-dimensional normalized floating-point visual feature vector.
- **Data Privacy**: Biometric vectors are **NEVER** written to the blockchain.

### Stage 2: Genuine Google Lens Web Discovery
- **Provider**: Google Lens via SerpApi (`engine=google_lens`).
- **2-Step Flow**:
  1. POST binary image bytes to `https://serpapi.com/image` -> obtain `image_id`.
  2. GET `https://serpapi.com/search.json?engine=google_lens&image_id=<image_id>&type=exact_matches / visual_matches`.
- **Data Contract**: Returns real candidate URLs, domain, title, snippet, and thumbnail. No fake candidates.

### Stage 3: Deterministic Canonical Fingerprinting (SHA-256)
- **Canonicalization Rules**:
  - Selects strictly immutable content fields (`author`, `domain`, `media_sha256`, `post_id`, `source_url`, `text_caption`, `title`).
  - Explicitly excludes dynamic execution state (timestamps, processing time, transaction hashes).
  - Encodes as compact UTF-8 JSON with sorted keys (`sort_keys=True`, `separators=(',', ':')`).
- **SHA-256 Hash**: Computes 256-bit hash, returned as `0x` + 64 hexadecimal characters (`bytes32_hex`).

### Stage 4: EVM Smart Contract Registration & Verification
- **Smart Contract**: `TraceChainRegistry.sol` (`contracts/TraceChainRegistry.sol`).
- **Blockchain Storage**: Stores `bytes32 fingerprint`, `uint256 timestamp`, `address submitter`, `string sourceUrl`.
- **Independent Verification**:
  1. Recomputes canonical JSON & SHA-256 independently from raw source payload.
  2. Queries the smart contract on-chain ledger (`getRecord(_fingerprint)`).
  3. Compares `local_recomputed_hash == on_chain_hash`.
  4. Displays **`✓ BLOCKCHAIN VERIFIED`** on exact match, or **`❌ VERIFICATION FAILED`** if tampered.

---

## ⚙️ Quick Start & Running Commands

### 1. Environment Setup (.env)
Ensure `backend/.env` contains your SerpApi key:
```env
SERPAPI_KEY=47ae6907340d5b34ca2e7d86a7322a7771283b58c74b970a6bed59fef51bf118
```

### 2. Run Backend Tests
```bash
python -m pytest backend/tests
```

### 3. Start Backend FastAPI Server (Port 8000)
```bash
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
```
- API Docs: `http://127.0.0.1:8000/docs`
- Health Endpoint: `http://127.0.0.1:8000/api/health`

### 4. Start Frontend React Vite Server (Port 5173)
```bash
cd frontend
npm run dev
```
- App Interface: `http://localhost:5173`

---

## 🔬 Blockchain & Verification Details

- **Blockchain Network**: Local EVM Testnet (PyEVM Provider).
- **Contract Address**: `0x5FbDB2315678afecb367f032d93F642f64180aa3`.
- **Tamper Evident Demo**: Controlled tamper simulator appends a character to content text, recomputes SHA-256, and demonstrates that the altered hash fails verification against the registered on-chain fingerprint (`TAMPERED SHA-256 != ON-CHAIN SHA-256`).
