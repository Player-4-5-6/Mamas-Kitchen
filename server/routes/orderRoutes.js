import express from "express";
import {
  placeOrder,
  getMyOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus,
  getSalesOverview,
} from "../controllers/orderController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, placeOrder);
router.get("/my-orders", protect, getMyOrders);
router.get("/stats/overview", protect, adminOnly, getSalesOverview);
router.get("/", protect, adminOnly, getAllOrders);
router.get("/:id", protect, getOrder);
router.patch("/:id/status", protect, adminOnly, updateOrderStatus);

export default router;
