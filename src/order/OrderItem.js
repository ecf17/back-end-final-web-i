class OrderItem {
    constructor({ id, order_id, product_id, quantity, price, created_at, updated_at, deleted_at }) {
        this.id = id;
        this.orderId = order_id;
        this.productId = product_id;
        this.quantity = quantity;
        this.price = price;
        this.createdAt = created_at;
        this.updatedAt = updated_at;
        this.deletedAt = deleted_at;
    }
}

export default OrderItem;
