import { handleRequest } from "../core/utils/handleRequest.js";
import orderService from "./OrderService.js";

class OrderController {
    async finalize(req, res) {
        await handleRequest(async (userId, addressId) => {
            const order = await orderService.finalizeOrder(userId, addressId);
            return { message: "Order finalized successfully", data: order };
        }, [req.user.id, req.body.addressId], res);
    }

    async getUserOrders(req, res) {
        await handleRequest(async (userId) => {
            const orders = await orderService.getUserOrders(userId);
            return { message: "User orders retrieved successfully", data: orders };
        }, [req.user.id], res);
    }

    async updateStatus(req, res) {
        await handleRequest(async (orderId, statusId) => {
            const updatedOrder = await orderService.updateOrderStatus(orderId, statusId);
            return { message: "Order status updated successfully", data: updatedOrder };
        }, [req.params.orderId, parseInt(req.body.statusId)], res);
    }
}

export default new OrderController();