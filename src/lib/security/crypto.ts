import crypto from "crypto";
import bcrypt from "bcryptjs";

const SECRET_KEY = process.env.DIGITAL_KEY_SECRET || "default-secret-persona-key-32b-pad!!";
// Generate a 32-byte key from the secret
const ENCRYPTION_KEY = crypto.createHash("sha256").update(SECRET_KEY).digest();
const IV_LENGTH = 16;

/**
 * Hash a password using bcrypt with salt 12
 */
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}

/**
 * Compare password with stored hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

/**
 * Generate a random cryptographically secure token (e.g. for email verification or password reset)
 */
export function generateSecureToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Hash a token with SHA-256 for secure DB storage (prevents DB leak exposure)
 */
export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/**
 * Encrypt a digital key (e.g., Steam Key) using AES-256-CBC
 */
export function encryptDigitalKey(plainKey: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(plainKey, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
}

/**
 * Decrypt a digital key
 */
export function decryptDigitalKey(encryptedPayload: string): string {
  try {
    const [ivHex, encryptedHex] = encryptedPayload.split(":");
    if (!ivHex || !encryptedHex) return "[INVALID_KEY_FORMAT]";
    const iv = Buffer.from(ivHex, "hex");
    const decipher = crypto.createDecipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
    let decrypted = decipher.update(encryptedHex, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (error) {
    console.error("Failed to decrypt digital key:", error);
    return "[DECRYPTION_ERROR]";
  }
}

/**
 * Mask a digital key for secure previews (e.g., "ABCD-EFGH-IJKL-MNOP" -> "ABCD-****-****-MNOP")
 */
export function maskDigitalKey(key: string): string {
  if (!key || key.length < 8) return "••••-••••-••••";
  const parts = key.split("-");
  if (parts.length >= 3) {
    return `${parts[0]}-${parts.slice(1, -1).map(() => "****").join("-")}-${parts[parts.length - 1]}`;
  }
  return `${key.slice(0, 4)}••••${key.slice(-4)}`;
}
