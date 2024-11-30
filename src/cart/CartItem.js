class CartItem {
    constructor({ id, cart_id, product_id, quantity, subtotal, created_at, updated_at, deleted_at }) {
        this.id = id;
        this.cartId = cart_id;
        this.productId = product_id;
        this.quantity = quantity;
        this.subtotal = subtotal;
        this.createdAt = created_at;
        this.updatedAt = updated_at;
        this.deletedAt = deleted_at;
    }
}

export default CartItem;
