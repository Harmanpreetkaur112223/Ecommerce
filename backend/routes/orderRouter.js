import express from 'express'
import { createOrder, getAllUsersOrders, getOrder, myOrders } from '../controllers/orderController.js';
import { veriffyJWT ,authorizeRole} from '../middleware/authMiddleware.js';
const router = express.Router();

router.route("/new").post(veriffyJWT,authorizeRole("admin"),createOrder)
router.route("/myOrders").get(veriffyJWT , myOrders);
router.route("/admin/orders").get(veriffyJWT , authorizeRole("admin"),getAllUsersOrders);
router.route("/:id").get(veriffyJWT,getOrder)
export default router;