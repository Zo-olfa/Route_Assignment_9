import bcrypt from "bcrypt";

export const hashPlainText = async (text, salt = 10) => {
  return await bcrypt.hash(text, salt);
};

export const isHashTextMatch = async (plain, hashed) => {
  if (!plain || !hashed) return false;
  return await bcrypt.compare(plain, hashed);
};

// import crypto from "node:crypto";

// export const hashPlainText = (text) => {
//   return crypto.createHash("sha256").update(text).digest("hex");
// };

// export const isHashMatch = (plain, hashed) => {
//   return hashPlainText(plain) === hashed;
// };
