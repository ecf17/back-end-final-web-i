import cartService from "../cart/CartService.js";
import orderRepository from "./OrderRepository.js";

class OrderService {
    async finalizeOrder(userId, addressId = null) {
        const cart = await cartService.ensureCart(userId, null);

        const cartItems = await cartService.getCartItems(cart.id);
        if (!cartItems.length) {
            throw new Error("Cart is empty. Cannot finalize order.");
        }

        const total = cartItems.reduce((sum, item) => {
            const subtotal = parseFloat(item.subtotal);
            if (isNaN(subtotal)) {
                throw new Error(`Invalid subtotal format: ${item.subtotal}`);
            }
            return sum + subtotal;
        }, 0);

        const order = await orderRepository.createOrder(userId, total, 1, addressId);

        const orderItems = cartItems.map(item => ({
            product_id: item.productId,
            quantity: item.quantity,
            price: item.subtotal / item.quantity,
        }));

        await orderRepository.addOrderItems(order.id, orderItems);

        await cartService.clearCart(cart.id);

        return order;
    }

    async getUserOrders(userId) {
        const orders = await orderRepository.getOrdersByUserId(userId);
        for (const order of orders) {
            order.items = await orderRepository.getOrderItems(order.id);
        }
        return orders;
    }

    async updateOrderStatus(orderId, statusId) {
        const validStatuses = [1, 2, 3];
        if (!validStatuses.includes(statusId)) {
            throw new Error("Invalid status ID");
        }

        // Actualizar el estado del pedido
        const updatedOrder = await orderRepository.updateOrderStatus(orderId, statusId);
        if (!updatedOrder) {
            throw new Error("Order not found or status update failed");
        }

        return updatedOrder;
    }
}

export default new OrderService();
