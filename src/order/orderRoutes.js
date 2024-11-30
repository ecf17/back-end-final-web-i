import { Router } from "express";
import {authenticateJWT} from "../core/middlewares/authenticateJWT.js";
import orderController from "./OrderController.js";
import {hasRole} from "../core/middlewares/authMiddleware.js";

const router = Router();

router.post("/finalize", authenticateJWT, orderController.finalize);
router.get("/history", authenticateJWT, orderController.getUserOrders);
router.put("/:orderId/status", authenticateJWT, hasRole('admin'), orderController.updateStatus);

export default router;
