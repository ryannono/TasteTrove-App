// eslint-disable-next-line node/no-extraneous-import
import {ProductCategoryPayload, ProductPayload} from '@prisma/client';

/**
 * The `MutableProductPayload` type takes all the scalar properties from
 * the `ProductPayload` type. Scalar properties are the base-level information
 * or primitive values (like strings, numbers, booleans, etc.) as opposed to
 * object structures.
 *
 * This type is typically used when you want to create or manipulate a product
 * and only care about the basic product details.
 */
export type MutableProductPayload = Omit<ProductPayload['scalars'], 'id'>;

/**
 * Type `MutableCategoryPayload` represents the mutable properties of
 * a product category. It omits the `id` property from
 * `ProductCategoryPayload['scalars']` as this property should not
 * be changed.
 */
export type MutableCategoryPayload = Omit<
  ProductCategoryPayload['scalars'],
  'id'
>;
