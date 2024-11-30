class Cart {
    constructor({ id, user_id, total, session_id, created_at, updated_at, deleted_at }) {
        this.id = id;
        this.userId = user_id;
        this.total = total;
        this.sessionId = session_id;
        this.createdAt = created_at;
        this.updatedAt = updated_at;
        this.deletedAt = deleted_at;
    }
}

export default Cart;
