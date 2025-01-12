import bcrypt from "bcrypt";

const saltRounds = 10;

/**
 * Encrypts a given value using bcrypt.
 *
 * @param {string} value - The value to encrypt.
 * @returns {Promise<{ hash: string; salt: string }>} An object containing the hash and the salt.
 */
export async function encrypt(
  value: string
): Promise<{ hash: string; salt: string }> {
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(value, salt);
  return { hash, salt };
}

/**
 * Verifies if a given value, when hashed with the provided salt, matches the given hash.
 *
 * @param {string} value - The value to verify.
 * @param {string} salt - The salt used for the hash.
 * @param {string} hash - The hash to compare against.
 * @returns {Promise<boolean>} True if the hashed value matches the given hash, otherwise false.
 */
export async function verify(
  value: string,
  salt: string,
  hash: string
): Promise<boolean> {
  const hashedValue = await bcrypt.hash(value, salt);
  return hashedValue === hash;
}

