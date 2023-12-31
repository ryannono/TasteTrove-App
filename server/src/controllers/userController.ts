import {NextFunction, Request, Response} from 'express';
import {prisma} from '../app';
import {MutableUserPayload, MutableCartItemPayload} from '../types';
import {getEssentialUserProps} from '../utils/';
import {TokenUserPayload, UserWithCart} from '../types/userTypes';
import {
  createCartItems,
  deleteCartItems,
  getActionArrays,
  updateCartItems,
} from '../utils/cartUtil';

// ------------------- User Controller ---------------------- //

/**
 * Asynchronous Express middleware to fetch all users from the database.
 * If successful, responds with a JSON array of all user objects.
 * If an error occurs, it is passed on to the next middleware for error handling.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function in the Express pipeline.
 *
 * @returns {Promise<void>} Nothing.
 *
 * @throws {Error} If any error occurs during the process.
 */
export async function getAllUsers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const user: TokenUserPayload = res.locals.user;

  try {
    const allUsers = await prisma.user.findMany({include: {cart: true}});
    const essentialAllUsers = allUsers.map(user =>
      getEssentialUserProps(user as UserWithCart)
    );
    return res.status(200).json({...user, allUsers: essentialAllUsers});
  } catch (err) {
    return next(err);
  }
}

export async function getUser(req: Request, res: Response, next: NextFunction) {
  const user: TokenUserPayload = res.locals.user;

  return res.status(200).json(user);
}

/**
 * Asynchronous Express middleware to fetch a specific user from the database by their ID.
 * If successful, responds with a JSON object of the user.
 * If an error occurs or the user is not found, it is passed on to the next middleware for error handling.
 *
 * @param {Request} req - The Express request object, expecting the user's ID in the parameters.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function in the Express pipeline.
 *
 * @returns {Promise<void>} Nothing.
 *
 * @throws {Error} If any error occurs during the process.
 */
export async function getUserById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const {id} = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: {id},
      include: {cart: true},
    });

    if (!user) return res.status(404).json({error: 'User not found'});
    return res.status(200).json(getEssentialUserProps(user as UserWithCart));
  } catch (err) {
    return next(err);
  }
}

/**
 * Asynchronous Express middleware to update a specific user in the database by their ID.
 * If successful, responds with a JSON object of the updated user.
 * If an error occurs, it is passed on to the next middleware for error handling.
 *
 * @param {Request} req - The Express request object, expecting the user's ID in the parameters and the updated data in the body.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function in the Express pipeline.
 *
 * @returns {Promise<void>} Nothing.
 *
 * @throws {Error} If any error occurs during the user updating process.
 */
export async function updateUserById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const {id} = req.params;
  const {role, ...otherUpdateData} = req.body as Partial<MutableUserPayload>;

  try {
    await prisma.user.update({
      where: {id},
      data: {
        role: role ? {set: role} : undefined,
        ...otherUpdateData,
      },
    });

    return res.status(200).json({message: 'User updated successfully'});
  } catch (err) {
    return next(err);
  }
}

/**
 * Asynchronous Express middleware to delete a specific user from the database by their ID.
 * If successful, responds with a JSON object of the deleted user.
 * If an error occurs, it is passed on to the next middleware for error handling.
 *
 * @param {Request} req - The Express request object, expecting the user's ID in the parameters.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function in the Express pipeline.
 *
 * @returns {Promise<void>} Nothing.
 *
 * @throws {Error} If any error occurs during the user deletion process.
 */
export async function deleteUserById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const {id} = req.params;

  try {
    await prisma.user.delete({
      where: {id},
    });

    return res.status(200).json({message: 'User deleted successfully'});
  } catch (err) {
    return next(err);
  }
}

// ------------------- User Cart Controller ---------------------- //

/**
 * Retrieves a user's shopping cart.
 *
 * This function handles the GET request to fetch a user's cart by their ID.
 * It fetches the cart associated with the given user ID from the database.
 *
 * @async
 * @param {Request} req - The incoming HTTP request. The request parameters
 *                        should contain the user ID.
 * @param {Response} res - The outgoing HTTP response. The response body will
 *                         contain the fetched cart if the operation is successful.
 * @param {NextFunction} next - Express.js next function.
 * @throws Will throw an error if the operation fails.
 * @returns {Promise<Response>} A Promise that resolves to the Express.js
 *                              response object.
 */
export async function getCart(req: Request, res: Response, next: NextFunction) {
  try {
    console.log(res.locals.user);

    const userId = req.params.userId;
    const cart = await prisma.cart.findUnique({
      where: {userId},
      select: {items: {select: {productId: true, productQuantity: true}}},
    });
    return res.status(200).json(cart);
  } catch (err) {
    return next(err);
  }
}

/**
 * Adds an item to a user's shopping cart.
 *
 * This function handles the POST request to add an item to a user's cart.
 * It updates the cart associated with the given user ID in the database.
 *
 * @async
 * @param {Request} req - The incoming HTTP request. The request parameters
 *                        should contain the user ID and the request body
 *                        should contain the product ID and quantity.
 * @param {Response} res - The outgoing HTTP response. The response body will
 *                         contain the updated cart if the operation is successful.
 * @param {NextFunction} next - Express.js next function.
 * @throws Will throw an error if the operation fails.
 * @returns {Promise<Response>} A Promise that resolves to the Express.js
 *                              response object.
 */
export async function addItemToCart(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {userId} = req.params;
    const {productId, productQuantity} = req.body as MutableCartItemPayload;

    const updatedCart = await prisma.cart.update({
      where: {userId},
      data: {
        items: {
          create: {
            productId,
            productQuantity,
          },
        },
      },
      select: {items: {select: {productId: true, productQuantity: true}}},
    });
    return res.status(200).json(updatedCart);
  } catch (err) {
    return next(err);
  }
}

/**
 * Updates the cart items of a specific user.
 *
 * This asynchronous function first gets the items in the user's cart and
 * creates a map (userCartMap) for fast access. Then, it categorizes the incoming items into arrays
 * based on if they need to be created, updated, or deleted.
 * Finally, it performs these create, update, and delete operations concurrently and sends a success message.
 *
 * @async
 * @function
 * @param {Request} req - Express.js request object containing the incoming cart items in the request body.
 * @param {Response} res - Express.js response object used to send the response.
 * @param {NextFunction} next - Express.js next function for error handling.
 * @throws {Error} Will throw an error if there is an issue in reading the user's current cart,
 * categorizing the incoming items, or in creating/updating/deleting the items.
 */
export async function updateCartItem(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {userId} = req.params;
    const user: TokenUserPayload = res.locals.user;
    const items = req.body as MutableCartItemPayload[];
    const userCartMap = new Map(
      (
        await prisma.cart.findUnique({
          where: {id: user.cartId},
          select: {items: true},
        })
      )?.items.map(item => [item.productId, item])
    );

    const {creates, deletes, updates} = getActionArrays(items, userCartMap);

    await Promise.all([
      updateCartItems(user.cartId, updates),
      deleteCartItems(user.cartId, deletes),
      createCartItems(user.cartId, creates),
    ]);

    return res.status(200).json({message: 'cart updated successfully'});
  } catch (err) {
    return next(err);
  }
}

/**
 * Removes an item from a user's shopping cart.
 *
 * This function handles the DELETE request to remove an item from a user's
 * cart. It updates the cart associated with the given user ID in the database.
 *
 * @async
 * @param {Request} req - The incoming HTTP request. The request parameters
 *                        should contain the user ID and the product ID.
 * @param {Response} res - The outgoing HTTP response. The response body will
 *                         contain the updated cart if the operation is successful.
 * @param {NextFunction} next - Express.js next function.
 * @throws Will throw an error if the operation fails.
 * @returns {Promise<Response>} A Promise that resolves to the Express.js
 *                              response object.
 */
export async function removeItemFromCart(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {userId, productId} = req.params;

    const cart = await prisma.cart.findUnique({
      where: {userId},
    });

    if (!cart) return res.status(404).json({error: 'No cart found'});

    const updatedCart = await prisma.cart.update({
      where: {id: cart?.id},
      data: {
        items: {
          delete: {
            cartId_productId: {
              cartId: cart.id,
              productId,
            },
          },
        },
      },
      select: {items: {select: {productId: true, productQuantity: true}}},
    });
    return res.status(200).json(updatedCart);
  } catch (err) {
    return next(err);
  }
}

/**
 * Clears a user's shopping cart.
 *
 * This function handles the DELETE request to clear a user's cart. It deletes
 * the cart associated with the given user ID from the database.
 *
 * @async
 * @param {Request} req - The incoming HTTP request. The request parameters
 *                        should contain the user ID.
 * @param {Response} res - The outgoing HTTP response. The response body will
 *                         contain the response of the delete operation if successful.
 * @param {NextFunction} next - Express.js next function.
 * @throws Will throw an error if the operation fails.
 * @returns {Promise<Response>} A Promise that resolves to the Express.js
 *                              response object.
 */
export async function clearCart(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.params.userId;

    await prisma.cartItem.deleteMany({
      where: {
        cart: {
          userId,
        },
      },
    });

    return res.status(200).json({message: 'Cart cleared successfully'});
  } catch (err) {
    return next(err);
  }
}
