"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategoryById = exports.updateCategoryById = exports.getCategoryById = exports.getAllCategories = exports.createCategory = exports.deleteProductById = exports.updateProductById = exports.getProductById = exports.getAllProducts = exports.createProduct = void 0;
const app_1 = require("../app");
// ------------------- Product Controller ---------------------- //
/**
 * Create a new product in the database. The product details
 * are received through the request body.
 *
 * @async
 * @function createProduct
 * @param {Request} req - The request object, the body should
 * be of type MutableProductPayload.
 * @param {Response} res - The response object, sends the
 * created product details as response.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<Response>} - The response object, sends
 * the created product details as response.
 */
async function createProduct(req, res, next) {
    try {
        const newProduct = await app_1.prisma.product.create({
            data: req.body,
        });
        return res.status(200).json(newProduct);
    }
    catch (err) {
        return next(err);
    }
}
exports.createProduct = createProduct;
/**
 * Fetch all products from the database.
 *
 * @async
 * @function getAllProducts
 * @param {Request} req - The request object.
 * @param {Response} res - The response object, sends all
 * the product details as response.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<Response>} - The response object, sends
 * all the products as response.
 */
async function getAllProducts(req, res, next) {
    try {
        const allProducts = await app_1.prisma.product.findMany({
            include: { images: true, category: true },
        });
        return res.status(200).json(allProducts);
    }
    catch (err) {
        return next(err);
    }
}
exports.getAllProducts = getAllProducts;
/**
 * Fetch a product from the database by its ID. The ID is
 * received through the request parameters.
 *
 * @async
 * @function getProductById
 * @param {Request} req - The request object, the parameters
 * should contain the ID of the product to fetch.
 * @param {Response} res - The response object, sends the
 * product details as response.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<Response>} - The response object, sends
 * the product details as response.
 */
async function getProductById(req, res, next) {
    const { id } = req.params;
    try {
        const product = await app_1.prisma.product.findUnique({
            where: { id },
            include: { images: true, category: true },
        });
        if (!product)
            return res.status(404).json({ error: 'Product not found' });
        return res.status(200).json(product);
    }
    catch (err) {
        return next(err);
    }
}
exports.getProductById = getProductById;
/**
 * Update a product in the database by its ID. The ID is
 * received through the request parameters, and the new
 * product details are received through the request body.
 *
 * @async
 * @function updateProductById
 * @param {Request} req - The request object, the parameters
 * should contain the ID of the product to update, and the
 * body should be of type MutableProductPayload with the
 * updated product details.
 * @param {Response} res - The response object, sends the
 * updated product details as response.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<Response>} - The response object, sends
 * the updated product details as response.
 */
async function updateProductById(req, res, next) {
    const { id } = req.params;
    try {
        const updatedProduct = await app_1.prisma.product.update({
            where: { id },
            data: req.body,
            include: { images: true, category: true },
        });
        return res.status(200).json(updatedProduct);
    }
    catch (err) {
        return next(err);
    }
}
exports.updateProductById = updateProductById;
/**
 * Delete a product from the database by its ID. The ID is
 * received through the request parameters.
 *
 * @async
 * @function deleteProductById
 * @param {Request} req - The request object, the parameters
 * should contain the ID of the product to delete.
 * @param {Response} res - The response object, sends the
 * deleted product details as response.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<Response>} - The response object, sends
 * the deleted product details as response.
 */
async function deleteProductById(req, res, next) {
    const { id } = req.params;
    try {
        const deletedProduct = await app_1.prisma.product.delete({
            where: { id },
            include: { images: true, category: true },
        });
        return res.status(200).json(deletedProduct);
    }
    catch (err) {
        return next(err);
    }
}
exports.deleteProductById = deleteProductById;
// ---------------- Product Category Controller ------------------ //
/**
 * Create a new product category in the database. The category details
 * are received through the request body.
 *
 * @async
 * @function createCategory
 * @param {Request} req - The request object, the body should
 * be of type MutableCategoryPayload.
 * @param {Response} res - The response object, sends the
 * created category details as response.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<Response>} - The response object, sends
 * the created category details as response.
 */
async function createCategory(req, res, next) {
    try {
        const newCategory = await app_1.prisma.productCategory.create({
            data: req.body,
        });
        return res.status(200).json(newCategory);
    }
    catch (err) {
        return next(err);
    }
}
exports.createCategory = createCategory;
/**
 * Fetch all categories from the database.
 *
 * @async
 * @function getAllCategories
 * @param {Request} req - The request object.
 * @param {Response} res - The response object, sends all
 * the category details as response.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<Response>} - The response object, sends
 * all the category details as response.
 */
async function getAllCategories(req, res, next) {
    try {
        const allCategories = await app_1.prisma.productCategory.findMany();
        return res.status(200).json(allCategories);
    }
    catch (err) {
        return next(err);
    }
}
exports.getAllCategories = getAllCategories;
/**
 * Fetch a category from the database by its ID. The ID is
 * received through the request parameters.
 *
 * @async
 * @function getCategoryById
 * @param {Request} req - The request object, the parameters
 * should contain the ID of the category to fetch.
 * @param {Response} res - The response object, sends the
 * category details as response.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<Response>} - The response object, sends
 * the category details as response.
 */
async function getCategoryById(req, res, next) {
    const { id } = req.params;
    try {
        const category = await app_1.prisma.productCategory.findUnique({
            where: { id },
        });
        if (!category)
            return res.status(404).json({ error: 'Category not found' });
        return res.status(200).json(category);
    }
    catch (err) {
        return next(err);
    }
}
exports.getCategoryById = getCategoryById;
/**
 * Update a category in the database by its ID. The ID is
 * received through the request parameters, and the new
 * category details are received through the request body.
 *
 * @async
 * @function updateCategoryById
 * @param {Request} req - The request object, the parameters
 * should contain the ID of the category to update, and the
 * body should be of type MutableCategoryPayload with the
 * updated category details.
 * @param {Response} res - The response object, sends the
 * updated category details as response.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<Response>} - The response object, sends
 * the updated category details as response.
 */
async function updateCategoryById(req, res, next) {
    const { id } = req.params;
    try {
        const updatedCategory = await app_1.prisma.productCategory.update({
            where: { id },
            data: req.body,
        });
        return res.status(200).json(updatedCategory);
    }
    catch (err) {
        return next(err);
    }
}
exports.updateCategoryById = updateCategoryById;
/**
 * Delete a category from the database by its ID. The ID is
 * received through the request parameters.
 *
 * @async
 * @function deleteCategoryById
 * @param {Request} req - The request object, the parameters
 * should contain the ID of the category to delete.
 * @param {Response} res - The response object, sends the
 * deleted category details as response.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<Response>} - The response object, sends
 * the deleted category details as response.
 */
async function deleteCategoryById(req, res, next) {
    const { id } = req.params;
    try {
        const deletedCategory = await app_1.prisma.productCategory.delete({
            where: { id },
        });
        return res.status(200).json(deletedCategory);
    }
    catch (err) {
        return next(err);
    }
}
exports.deleteCategoryById = deleteCategoryById;
//# sourceMappingURL=productController.js.map