import { Router } from "express";
import cartController from "./CartController.js";
import guestSessionMiddleware from "../core/middlewares/guestSessionMiddleware.js";

const router = Router();

router.use(guestSessionMiddleware);

router.post("/add", cartController.addItem);
router.get("/", cartController.getCart);
router.patch("/item/quantity", cartController.updateItemQuantity);
router.delete("/item/:productId", cartController.deleteItem);

export default router;
