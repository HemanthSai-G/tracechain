/**
 * TRACECHAIN Centralized API Service Abstraction
 * Wraps backend endpoints cleanly for React components and pipeline hooks.
 */

const API_BASE = '/api';

export const apiService = {
  async checkHealth() {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error(`Health check failed: HTTP ${res.status}`);
    return await res.json();
  },

  async detectFace(file) {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_BASE}/face/detect`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error(`Face detection failed: HTTP ${res.status}`);
    return await res.json();
  },

  async searchWeb(imageBase64, embedding = []) {
    const res = await fetch(`${API_BASE}/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image_base64: imageBase64,
        embedding: embedding,
        max_results: 10
      })
    });
    if (!res.ok) throw new Error(`Search request failed: HTTP ${res.status}`);
    return await res.json();
  },

  async generateFingerprint(contentPayload) {
    const res = await fetch(`${API_BASE}/fingerprint`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: contentPayload })
    });
    if (!res.ok) throw new Error(`Fingerprint generation failed: HTTP ${res.status}`);
    return await res.json();
  },

  async registerBlockchain(fingerprintHex, sourceUrl) {
    const res = await fetch(`${API_BASE}/blockchain/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fingerprint: fingerprintHex,
        source_url: sourceUrl
      })
    });
    if (!res.ok) throw new Error(`Blockchain registration failed: HTTP ${res.status}`);
    return await res.json();
  },

  async verifyBlockchain(contentPayload) {
    const res = await fetch(`${API_BASE}/blockchain/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: contentPayload })
    });
    if (!res.ok) throw new Error(`Blockchain verification failed: HTTP ${res.status}`);
    return await res.json();
  },

  async simulateTamper(originalContent, tamperedField = "text_caption", tamperValue = " [TAMPERED CHAR]") {
    const res = await fetch(`${API_BASE}/blockchain/tamper-test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        original_content: originalContent,
        tampered_field: tamperedField,
        tamper_value: tamperValue
      })
    });
    if (!res.ok) throw new Error(`Tamper simulation failed: HTTP ${res.status}`);
    return await res.json();
  }
};
