// AES-256-GCM helpers for encrypting per-user connector credentials.
// The encryption key is derived (SHA-256) from APP_USER_CONNECTION_KEY_SECRET
// so any sufficiently-long random secret works as the source.
// Server-only — never import from browser code.
import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

function key(): Buffer {
  const raw = process.env.APP_USER_CONNECTION_KEY_SECRET;

  const clean = typeof raw === "string" ? raw.trim().replace(/^["']|["']$/g, "") : "";
  if (!clean) throw new Error("APP_USER_CONNECTION_KEY_SECRET is not set");
  if (clean.length < 32) throw new Error("APP_USER_CONNECTION_KEY_SECRET is too short");
  return createHash("sha256").update(clean, "utf8").digest();
}

export function encryptConnectionKey(plaintext: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const ct = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), ct]).toString("base64");
}

export function decryptConnectionKey(stored: string): string {
  if (!stored) throw new Error("Invalid ciphertext: empty payload");
  const buf = Buffer.from(stored, "base64");
  if (buf.length < 28) throw new Error("Invalid ciphertext: payload too short");
  const iv = buf.subarray(0, 12);
  const tag = buf.subarray(12, 28);
  const ct = buf.subarray(28);
  const decipher = createDecipheriv("aes-256-gcm", key(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(ct), decipher.final()]).toString("utf8");
}
