"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orderController_1 = require("../controllers/orderController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
// -- note order creation is handled by payment controller
router.get('/', authMiddleware_1.authenticateAccessToken, authMiddleware_1.verifyAdmin, orderController_1.getAllOrders);
router.get('/:id', orderController_1.getOrderById);
router.delete('/:id', authMiddleware_1.authenticateAccessToken, authMiddleware_1.verifyAdmin, orderController_1.deleteOrderById);
router.delete('/:orderId/items', orderController_1.getOrderItemsById);
exports.default = router;
//# sourceMappingURL=orderRoutes.js.map