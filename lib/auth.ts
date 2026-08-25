import crypto from "crypto";
// Simple password hashing using crypto (PBKDF2)
export const hashPassword = async (password: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(32).toString("hex");
    crypto.pbkdf2(password, salt, 100000, 64, "sha512", (err, derivedKey) => {
      if (err) reject(err);
      resolve(`${salt}:${derivedKey.toString("hex")}`);
    });
  });
};
// Compare password with hash
export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const [salt, key] = hash.split(":");
    crypto.pbkdf2(password, salt, 100000, 64, "sha512", (err, derivedKey) => {
      if (err) reject(err);
      resolve(key === derivedKey.toString("hex"));
    });
  });
};
// Generate JWT token using crypto
export const generateToken = (payload: any, expiresIn: string = "7d"): string => {
  const secret = process.env.JWT_SECRET || "your-secret-key";
  
  // Calculate expiration time
  let expirationSeconds = 7 * 24 * 60 * 60; // default 7 days
  if (expiresIn === "1h") expirationSeconds = 60 * 60;
  else if (expiresIn === "24h") expirationSeconds = 24 * 60 * 60;
  
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const payloadObj = {
    ...payload,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + expirationSeconds,
  };
  const payloadStr = Buffer.from(JSON.stringify(payloadObj)).toString("base64url");
  
  const signature = crypto
    .createHmac("sha256", secret)
    .update(`${header}.${payloadStr}`)
    .digest("base64url");
  
  return `${header}.${payloadStr}.${signature}`;
};
// Verify JWT token using crypto
export const verifyToken = (token: string): any => {
  const secret = process.env.JWT_SECRET || "your-secret-key";
  try {
    const parts = token.split(".");
    
    if (parts.length !== 3) {
      return null;
    }
    const [headerB64, payloadB64, signatureB64] = parts;
    // Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${headerB64}.${payloadB64}`)
      .digest("base64url");
    if (signatureB64 !== expectedSignature) {
      return null;
    }
    // Decode payload
    const payloadStr = Buffer.from(payloadB64, "base64url").toString("utf-8");
    const payload = JSON.parse(payloadStr);
    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return null;
    }
    return payload;
  } catch (error) {
    return null;
  }
};