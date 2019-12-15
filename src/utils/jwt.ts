import { sign, verify } from 'jsonwebtoken';

/**
 * @description A function for signing jwt tokens
 * @param {object} payload the payload to be signed into the token
 * @param {string} expiresIn the expiry duration: in milliseconds eg `84600`
 * or string eg `1h`, `15d`, etc defaults to `72 hours` if not supplied
 */
export const createToken = (
  payload: any,
  expiresIn?: string | number
): string => {
  const secret = process.env.JWT_SECRET;
  return sign(payload, secret, {
    expiresIn: expiresIn || '72h',
  });
};

/**
 * @description A function for verifying jwt tokens
 * @param {string} token the token to be verified
 * @return {object} decoded object containing the decoded payload or error object
 */
export const verifyToken = (token: string): any => {
  const secret = process.env.JWT_SECRET;
  return verify(token, secret, (err: any, decoded: any) => decoded);
};
