// HMAC utility for API requests
import CryptoJS from 'crypto-js';

export function generateHmacHeaders(device, body = {}) {
  const deviceId = device.deviceId;
  const clientId = device.clientId;
  const secret = device.secret;
  const nonce = Math.random().toString(36).slice(2, 12);
  const ts = Date.now().toString();
  const bodyStr = typeof body === 'string' ? body : JSON.stringify(body || {});
  const base = `${deviceId}.${clientId}.${nonce}.${ts}.${bodyStr}`;
  const sig = CryptoJS.HmacSHA256(base, secret).toString(CryptoJS.enc.Hex);
  return {
    'X-Device-Id': deviceId,
    'X-Client-Id': clientId,
    'X-Nonce': nonce,
    'X-Timestamp': ts,
    'X-Signature': sig,
  };
}

export function getStoredDevice() {
  try {
    return JSON.parse(localStorage.getItem('device') || 'null');
  } catch {
    return null;
  }
}

export function storeDevice(device) {
  localStorage.setItem('device', JSON.stringify(device));
}
