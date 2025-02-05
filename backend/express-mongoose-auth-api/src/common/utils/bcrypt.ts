import { randomBytes, pbkdf2Sync, timingSafeEqual } from "node:crypto";

const hashValue = async (value: string, saltRounds = 10) => {
  const salt = randomBytes(saltRounds).toString("hex");
  const hash = pbkdf2Sync(value, salt, 100000, 64, "sha256").toString("hex");
  return `${salt}:${hash}`;
};

const compareValue = async (value: string, hashedValue: string) => {
  const [salt, hash] = hashedValue.split(":");
  const derivedHash = pbkdf2Sync(value, salt, 100000, 64, "sha256").toString(
    "hex"
  );
  return timingSafeEqual(
    Buffer.from(hash, "hex"),
    Buffer.from(derivedHash, "hex")
  );
};

export { hashValue, compareValue };
