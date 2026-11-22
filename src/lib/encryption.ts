import CryptoJS from 'crypto-js';

const ENCRYPTION_PREFIX = 'civicos_enc_';

/**
 * Encrypt a string with AES-256
 */
export function encrypt(data: string, key: string): string {
  return ENCRYPTION_PREFIX + CryptoJS.AES.encrypt(data, key).toString();
}

/**
 * Decrypt an AES-256 encrypted string
 */
export function decrypt(ciphertext: string, key: string): string {
  const raw = ciphertext.replace(ENCRYPTION_PREFIX, '');
  const bytes = CryptoJS.AES.decrypt(raw, key);
  return bytes.toString(CryptoJS.enc.Utf8);
}

/**
 * Encrypt an ArrayBuffer (for PDF blobs)
 */
export function encryptBlob(buffer: ArrayBuffer, key: string): string {
  const wordArray = CryptoJS.lib.WordArray.create(buffer as unknown as number[]);
  return CryptoJS.AES.encrypt(wordArray, key).toString();
}

/**
 * Decrypt back to ArrayBuffer
 */
export function decryptBlob(ciphertext: string, key: string): ArrayBuffer {
  const decrypted = CryptoJS.AES.decrypt(ciphertext, key);
  const typedArray = convertWordArrayToUint8Array(decrypted);
  return typedArray.slice().buffer;
}

function convertWordArrayToUint8Array(wordArray: CryptoJS.lib.WordArray): Uint8Array {
  const len = wordArray.sigBytes;
  const words = wordArray.words;
  const result = new Uint8Array(len);
  let i = 0;
  let j = 0;
  while (i < len) {
    const w = words[j++];
    if (w === undefined) break;
    result[i++] = (w >> 24) & 0xff;
    if (i < len) result[i++] = (w >> 16) & 0xff;
    if (i < len) result[i++] = (w >> 8) & 0xff;
    if (i < len) result[i++] = w & 0xff;
  }
  return result;
}

