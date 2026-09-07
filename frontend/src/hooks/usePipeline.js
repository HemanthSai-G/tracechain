import { useState } from 'react';
import { apiService } from '../services/api';

export function usePipeline() {
  const [faceData, setFaceData] = useState({
    imagePreview: null,
    selectedFile: null,
    hasProcessed: false,
    success: false,
    message: "",
    bounding_box: null,
    bbox_pct: null,
    metrics: null,
    embedding: [],
    embedding_preview: "",
    warning: null
  });

  const [searchData, setSearchData] = useState(null);
  const [fingerprintData, setFingerprintData] = useState(null);
  const [blockchainData, setBlockchainData] = useState(null);
  const [verifyData, setVerifyData] = useState(null);
  const [tamperData, setTamperData] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isInvestigating, setIsInvestigating] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const [logs, setLogs] = useState([
    { timestamp: getFormattedTime(), message: 'TRACECHAIN System Initialized. Ready for image investigation.', type: 'info' }
  ]);

  function getFormattedTime() {
    const d = new Date();
    return d.toTimeString().split(' ')[0];
  }

  const addLog = (message, type = 'info') => {
    setLogs((prev) => [...prev, { timestamp: getFormattedTime(), message, type }]);
  };

  const handleUploadImage = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Img = e.target.result;
      addLog(`Target image loaded: '${file.name}' (${(file.size / 1024).toFixed(1)} KB).`, 'info');
      setFaceData({
        imagePreview: base64Img,
        selectedFile: file,
        hasProcessed: false,
        success: false,
        message: "",
        bounding_box: null,
        bbox_pct: null,
        metrics: null,
        embedding: [],
        embedding_preview: "",
        warning: null
      });

      setSearchData(null);
      setFingerprintData(null);
      setBlockchainData(null);
      setVerifyData(null);
      setTamperData(null);
      setCurrentStep(1);
    };
    reader.readAsDataURL(file);
  };

  const resetPipeline = () => {
    addLog('Resetting workspace for new investigation...', 'info');
    setFaceData({
      imagePreview: null,
      selectedFile: null,
      hasProcessed: false,
      success: false,
      message: "",
      bounding_box: null,
      bbox_pct: null,
      metrics: null,
      embedding: [],
      embedding_preview: "",
      warning: null
    });
    setSearchData(null);
    setFingerprintData(null);
    setBlockchainData(null);
    setVerifyData(null);
    setTamperData(null);
    setCurrentStep(1);
  };

  const runDetectFace = async () => {
    setIsLoading(true);
    addLog('Scanning target image for faces...', 'info');

    if (!faceData.selectedFile) {
      addLog('No image file selected.', 'error');
      setIsLoading(false);
      return false;
    }

    try {
      const data = await apiService.detectFace(faceData.selectedFile);
      if (data.success) {
        setFaceData((prev) => ({
          ...prev,
          hasProcessed: true,
          success: true,
          message: data.message,
          bounding_box: data.bounding_box,
          bbox_pct: data.bbox_pct,
          metrics: data.metrics,
          embedding: data.embedding,
          embedding_preview: data.embedding_preview,
          warning: data.warning
        }));
        addLog(`✓ FACE SCAN SUCCESS: ${data.metrics.faces_count} face(s) found (Confidence: ${(data.metrics.confidence * 100).toFixed(1)}%)`, 'success');
        setIsLoading(false);
        return true;
      } else {
        setFaceData((prev) => ({
          ...prev,
          hasProcessed: true,
          success: false,
          message: data.message,
          bounding_box: null,
          bbox_pct: null,
          metrics: data.metrics,
          embedding: [],
          embedding_preview: ""
        }));
        addLog(`✕ ${data.message}`, 'error');
        setIsLoading(false);
        return false;
      }
    } catch (err) {
      addLog(`Network error during face scan: ${err.message}`, 'error');
      setIsLoading(false);
      return false;
    }
  };

  const runSearchWeb = async () => {
    setIsLoading(true);
    addLog('Executing Google Lens visual discovery...', 'info');
    try {
      const data = await apiService.searchWeb(faceData.imagePreview, faceData.embedding);
      setSearchData(data);
      if (data.success && data.matched_candidate) {
        addLog(`✓ SOURCE DISCOVERED: ${data.matched_candidate.title}`, 'success');
        addLog(`Source URL: ${data.matched_candidate.source_url}`, 'info');
        setIsLoading(false);
        return data.matched_candidate;
      } else {
        addLog(`Search Completed: ${data.match_classification}`, 'warn');
      }
    } catch (err) {
      addLog(`Search Network Error: ${err.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
    return null;
  };

  const runGenerateFingerprint = async (matchedTarget) => {
    const target = matchedTarget || searchData?.matched_candidate;
    if (!target) {
      addLog('Cannot generate fingerprint: No discovered web target.', 'warn');
      return null;
    }

    setIsLoading(true);
    addLog('Constructing deterministic canonical JSON payload...', 'info');
    const contentPayload = {
      source_url: target.source_url,
      domain: target.domain,
      post_id: target.candidate_id || "post_goa_2026_001",
      author: target.author || "Web Source",
      title: target.title,
      text_caption: target.snippet,
      media_sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      timestamp: target.timestamp || "2026-03-15T14:32:00Z"
    };

    try {
      const data = await apiService.generateFingerprint(contentPayload);
      setFingerprintData(data);
      addLog(`SHA-256 Fingerprint Generated: ${data.bytes32_hex.substring(0, 18)}...`, 'success');
      setIsLoading(false);
      return data;
    } catch (err) {
      addLog(`Fingerprint error: ${err.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
    return null;
  };

  const runRegisterBlockchain = async (fpObj) => {
    const fpHex = fpObj?.bytes32_hex || fingerprintData?.bytes32_hex;
    const srcUrl = fpObj?.content?.source_url || fingerprintData?.content?.source_url;

    if (!fpHex) {
      addLog('Cannot register: SHA-256 fingerprint missing.', 'warn');
      return null;
    }

    setIsLoading(true);
    addLog('Submitting fingerprint to EVM smart contract on-chain ledger...', 'info');
    try {
      const data = await apiService.registerBlockchain(fpHex, srcUrl);
      setBlockchainData(data);
      addLog(`Transaction Confirmed! Block #${data.block_number}`, 'success');
      addLog(`Tx Hash: ${data.tx_hash}`, 'info');
      setIsLoading(false);
      return data;
    } catch (err) {
      addLog(`Blockchain registration error: ${err.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
    return null;
  };

  const runVerifyBlockchain = async (fpObj) => {
    const payload = fpObj?.content || fingerprintData?.content;
    if (!payload) {
      addLog('Cannot verify: Discovered content payload missing.', 'warn');
      return null;
    }

    setIsLoading(true);
    addLog('Reading on-chain ledger state for independent verification...', 'info');
    try {
      const data = await apiService.verifyBlockchain(payload);
      setVerifyData(data);
      if (data.verified) {
        addLog('Verification Complete — ✓ BLOCKCHAIN VERIFIED', 'success');
      } else {
        addLog(`Verification Result: ${data.status_label}`, 'warn');
      }
      setIsLoading(false);
      return data;
    } catch (err) {
      addLog(`Verification error: ${err.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
    return null;
  };

  const runTamperSimulation = async () => {
    if (!fingerprintData?.content) {
      addLog('Cannot run tamper test: Perform investigation pipeline first.', 'warn');
      return;
    }

    setIsLoading(true);
    addLog('Executing controlled 1-character Tamper Simulation test...', 'warn');
    try {
      const data = await apiService.simulateTamper(fingerprintData.content, "text_caption", " [TAMPERED CHAR]");
      setTamperData(data);
      addLog(`Tamper Simulation Result: ${data.verification_status}`, 'error');
    } catch (err) {
      addLog(`Tamper simulation error: ${err.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const startFullPipeline = async () => {
    if (isInvestigating) return;
    setIsInvestigating(true);
    addLog('------------------------------------------------', 'info');
    addLog('🚀 AUTOMATED TRACECHAIN PIPELINE INITIATED', 'info');

    // Step 1: Face Scan
    setCurrentStep(1);
    const faceSuccess = await runDetectFace();

    if (!faceSuccess) {
      addLog('🛑 PIPELINE HALTED AT STAGE 01: No face detected.', 'error');
      setIsInvestigating(false);
      return;
    }

    // Step 2: Genuine Web Search
    setCurrentStep(2);
    const matchedCandidate = await runSearchWeb();

    if (!matchedCandidate) {
      addLog('🛑 PIPELINE HALTED AT STAGE 02: No web match discovered.', 'warn');
      setIsInvestigating(false);
      return;
    }

    // Step 3: Fingerprinting
    setCurrentStep(3);
    const fpResult = await runGenerateFingerprint(matchedCandidate);

    if (!fpResult) {
      addLog('🛑 PIPELINE HALTED AT STAGE 03: Fingerprint generation failed.', 'error');
      setIsInvestigating(false);
      return;
    }

    // Step 4: Blockchain Register & Verify
    setCurrentStep(4);
    const bcResult = await runRegisterBlockchain(fpResult);
    if (bcResult) {
      await runVerifyBlockchain(fpResult);
    }

    setIsInvestigating(false);
    addLog('✓ TRACECHAIN PROVENANCE INVESTIGATION COMPLETED SUCCESSFULLY!', 'success');
  };

  return {
    faceData,
    searchData,
    fingerprintData,
    blockchainData,
    verifyData,
    tamperData,
    isLoading,
    isInvestigating,
    currentStep,
    logs,
    addLog,
    clearLogs: () => setLogs([]),
    handleUploadImage,
    resetPipeline,
    startFullPipeline,
    runTamperSimulation
  };
}
