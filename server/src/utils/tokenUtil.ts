/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line node/no-extraneous-import
import {User} from '@prisma/client';
import jwt, {JwtPayload} from 'jsonwebtoken';
import {TokenUserPayload} from './types';

/**
 * Generate an access token for a given user. The token will contain the user's ID,
 * username, email, and names.
 *
 * @param {User} user - The user object which should include id, username, email, firstName, lastName.
 *
 * @returns {string} The generated JSON Web Token (JWT).
 *
 * @throws {Error} If any error occurs during the token generation.
 */
export function generateAccessToken({id, email, firstName, lastName}: User) {
  return jwt.sign(
    {id, email, firstName, lastName},
    process.env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: '20m',
    }
  );
}

/**
 * Generate a refresh token for a given user. The token will contain the user's ID,
 * username, email, and names.
 *
 * @param {User} user - The user object which should include id, username, email, firstName, lastName.
 *
 * @returns {string} The generated JSON Web Token (JWT).
 *
 * @throws {Error} If any error occurs during the token generation.
 */
export function generateRefreshToken({id, email, firstName, lastName}: User) {
  return jwt.sign(
    {id, email, firstName, lastName},
    process.env.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: '14d',
    }
  );
}

/**
 * Asynchronous function to verify a given JSON Web Token (JWT).
 *
 * This function will use JWT's verify method to validate the token
 * against the refresh token secret defined in the environment variables.
 *
 * @param token - The JWT that needs to be verified.
 *
 * @returns A Promise that either:
 *   1. Resolves with the user payload data (of type TokenUserPayload),
 *      which includes properties such as the user ID, username, email,
 *      first name and last name, if the token is valid.
 *   2. Resolves with null, indicating that the token is invalid or
 *      has been tampered with.
 */
export function verifyToken(token: string): Promise<TokenUserPayload | null> {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET as string,
      (err, tokenUserPayloadAndJwt) => {
        if (err) {
          resolve(null);
        } else {
          const {iat, exp, ...tokenUserPayload} =
            tokenUserPayloadAndJwt as TokenUserPayload &
              Pick<JwtPayload, 'iat' | 'exp'>;
          resolve(tokenUserPayload);
        }
      }
    );
  });
}
