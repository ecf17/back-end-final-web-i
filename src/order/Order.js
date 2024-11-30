class Order {
    constructor({ id, user_id, total, status_id, address_id, created_at, updated_at, deleted_at }) {
        this.id = id;
        this.userId = user_id;
        this.total = total;
        this.statusId = status_id;
        this.addressId = address_id;
        this.createdAt = created_at;
        this.updatedAt = updated_at;
        this.deletedAt = deleted_at;
    }
}

export default Order;
