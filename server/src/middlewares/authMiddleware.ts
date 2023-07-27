import {Request, Response, NextFunction} from 'express';
import {verifyToken} from '../utils/tokenUtil';

/**
 * Middleware function to authenticate user access.
 *
 * This function retrieves the access token from the incoming request's cookies,
 * verifies the token and checks whether the user has valid access permissions.
 *
 * If the access token is missing, or if it's not verified, a JSON response with an
 * error message is sent and the middleware chain is interrupted. If the token is
 * valid, the next middleware function in the chain is invoked.
 *
 * This function should be used in routes where authenticated access is required.
 *
 * @param req - Express.js request object containing the client request information.
 * @param res - Express.js response object for sending responses to the client.
 * @param next - Callback function to invoke the next middleware function in the chain.
 *
 * @throws {Error} When an unexpected error occurs during token verification.
 *
 * @returns {void} This function does not have a return value.
 */
export async function authenticateAccessToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // get accessToken from request
    const accessToken = req.cookies.accessToken;
    const noAccess = () => {
      return res.status(401).json({error: 'User does not have access'});
    };

    // check token exists
    if (!accessToken) return noAccess();

    // verify token
    const isVerified = await verifyToken(accessToken);
    if (!isVerified) return noAccess();

    // next function
    return next();
  } catch (err) {
    next(err);
  }
}
