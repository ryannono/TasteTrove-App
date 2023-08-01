import axios from '../../axios';
import {IndividualProduct} from '../useProducts';
import {Action, IndividualCartItem, State} from './useCartTypes';

// ---------------- Calculations ------------------ //

export function getTotals(
  cart: IndividualCartItem[],
  productsMap: Map<string, IndividualProduct>
) {
  let totalPrice = 0,
    totalQuantity = 0;
  for (const cartItem of cart) {
    totalQuantity += cartItem.productQuantity;
    const productMatch = productsMap.get(cartItem.productId);
    const cost = (productMatch?.price ?? 0) * cartItem.productQuantity;
    totalPrice += cost;
  }

  totalPrice = Math.round(totalPrice * 100) / 100;
  return {price: totalPrice, quantity: totalQuantity};
}

// ---------------- Local Storage ---------------- //

/**
 * Stores the current state of the cart in the local storage.
 *
 * @param cart - An array of items in the cart.
 */
export function saveLocalCart(cart: IndividualCartItem[]) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

/**
 * Updates the quantity of an item in the cart stored in the local storage.
 *
 * @param cart - An array of items in the cart.
 * @param itemToEditId - The ID of the item to be updated.
 * @param newQuantity - The new quantity of the item.
 *
 * @returns An updated array of items in the cart.
 */
export function updateLocalCart(
  cart: IndividualCartItem[],
  itemToEditId: string,
  newQuantity: number
): IndividualCartItem[] {
  if (!cart.length && newQuantity === 0) return cart;
  // If the new quantity is 0, filter out the item and return the cart
  if (newQuantity === 0) {
    return cart.filter(cartItem => cartItem.productId !== itemToEditId);
  }

  // Check if the item exists in the cart
  const existingItemIndex = cart.findIndex(
    cartItem => cartItem.productId === itemToEditId
  );

  // If the item exists, update the quantity. Otherwise, add the item to the cart.
  if (existingItemIndex !== -1) {
    // Create a new copy of the cart for immutability
    return cart.with(existingItemIndex, {
      productId: itemToEditId,
      productQuantity: newQuantity,
    });
  } else {
    return [...cart, {productId: itemToEditId, productQuantity: newQuantity}];
  }
}

// ------------------ Database -------------------- //

export async function updateDatabaseCart(
  updateArray: IndividualCartItem[],
  userId: string
) {
  try {
    // send all pending updates as single request
    await axios.put(`/users/${userId}/cart`, updateArray);
  } catch (err) {
    console.error(err);
  }
}

export async function pushLocalCartToDatabase(userId: string) {
  const localCart = await getCart(undefined);
  if (localCart) updateDatabaseCart(localCart, userId);
}

// ----------------- Cart fetch ------------------- //

/**
 * Fetches the cart of a user. If the user is not signed in, it retrieves the cart from the local storage.
 *
 * @param userId - The ID of the user.
 *
 * @returns A Promise that resolves to an array of items in the cart, or null if there's an error.
 */
export async function getCart(
  userId?: string
): Promise<IndividualCartItem[] | null> {
  if (userId) {
    try {
      const cart = (await axios.get(`/users/${userId}/cart`)).data.items;
      saveLocalCart(cart);
      return cart;
    } catch (err) {
      console.error(err);
      return null;
    }
  } else {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  }
}

// -----------------`States` ---------------- //

/**
 * The reducer function for the useReducer hook in the Cart component.
 *
 * @param state - The current state of the component.
 * @param action - The action to perform on the state.
 * @returns The new state after the action is performed.
 */
export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_CART':
      return {...state, cart: action.cart};
    case 'SET_TOTALS':
      return {...state, totals: action.totals};
    case 'SET_CART_AND_TOTALS':
      return {...state, cart: action.cart, totals: action.totals};
    default:
      return state;
  }
}
