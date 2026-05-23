import crypto from "node:crypto";

export const encryptPlainText = (text) => {
  const iv = crypto.randomBytes(16);
  const secretKey = process.env.ENCRYPTION_KEY;

  const cipher = crypto.createCipheriv(
    process.env.ENCRYPTION_ALGORITHM,
    Buffer.from(secretKey),
    iv,
  );

  let encryption = cipher.update(text, "utf8", "base64");
  encryption += cipher.final("base64");

  return { plain: encryption, iv: iv.toString("hex") };
};

export const decryptPlainText = (plain, iv) => {
  if (!plain || !iv) return null;

  const secretKey = process.env.ENCRYPTION_KEY;

  const decipher = crypto.createDecipheriv(
    process.env.ENCRYPTION_ALGORITHM,
    Buffer.from(secretKey),
    Buffer.from(iv, "hex"),
  );

  let decryption = decipher.update(plain, "base64", "utf8");
  decryption += decipher.final("utf8");

  return decryption;
};
