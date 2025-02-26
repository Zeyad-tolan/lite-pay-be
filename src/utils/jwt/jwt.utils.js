import jwt from 'jsonwebtoken';
import env from 'dotenv';
import { AppErrorService } from '../../services/ErrorHandler.services.js';

env.config();

/**
 * Generates a JSON Web Token (JWT) from given data.
 * @param {Object} data - Data to be encoded in the token
 * @returns {string} The generated token
 * @throws {Error} If there is an error generating the token
 */
export const makeToken = (data) => {
  try {
    const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '1d' });
    return token;
  } catch (error) {
    throw new AppErrorService(400,'Error generating token');
  }
};


/**
 * Decodes a given JSON Web Token (JWT).
 * @param {string} token - The token to be decoded
 * @returns {Object} The decoded data
 * @throws {Error} If there is an error decoding the token
 */
export const decodeToken = (token) => {
  try {
    const decodedToken = jwt.decode(token);
    return decodedToken;
  } catch (error) {
    throw new AppErrorService(400,'Error decoding token');
  }
};


/**
 * Verifies a given JSON Web Token (JWT) asynchronously.
 * @param {string} token - The token to be verified
 * @returns {Promise<Object>} A promise that resolves with the decoded token data if verification is successful
 * @throws {string} An error message if token verification fails
 */
export const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (error) {
        throw new AppErrorService(498,'Token verification failed');
      }
      resolve(decoded);
    });
  });
};
