import Order from "./Order.js";
import OrderItem from "./OrderItem.js";
import query from "../core/config/dbConfig.js";

class OrderRepository {
    async createOrder(userId, total, statusId, addressId = null) {
        const sql = `
            INSERT INTO order_detail (user_id, total, status_id, address_id, created_at, updated_at)
            VALUES ($1, $2, $3, $4, now(), now())
            RETURNING *
        `;
        const result = await query(sql, [userId, total, statusId, addressId]);
        return new Order(result.rows[0]);
    }

    async getOrdersByUserId(userId) {
        const sql = `
            SELECT od.*, os.name AS status_name
            FROM order_detail od
                     JOIN order_status os ON od.status_id = os.id
            WHERE od.user_id = $1 AND od.deleted_at IS NULL
            ORDER BY od.created_at DESC
        `;
        const result = await query(sql, [userId]);
        return result.rows.map(row => new Order(row));
    }

    async getOrderItems(orderId) {
        const sql = `
            SELECT oi.*, p.name, p.description
            FROM order_item oi
                     JOIN product p ON oi.product_id = p.id
            WHERE oi.order_id = $1
        `;
        const result = await query(sql, [orderId]);
        return result.rows.map(row => new OrderItem(row));
    }

    async updateOrderStatus(orderId, statusId) {
        const sql = `
            UPDATE order_detail
            SET status_id = $1, updated_at = now()
            WHERE id = $2 AND deleted_at IS NULL
            RETURNING *
        `;
        const result = await query(sql, [statusId, orderId]);
        return result.rows.length ? new Order(result.rows[0]) : null;
    }

    async addOrderItems(orderId, items) {
        const values = items.map(item => `(
            '${orderId}',
            '${item.product_id}',
            ${item.quantity},
            ${item.price},
            now(),
            now()
        )`).join(',');

        const sql = `
            INSERT INTO order_item (order_id, product_id, quantity, price, created_at, updated_at)
            VALUES ${values}
        `;
        await query(sql);
    }

    async deleteOrder(orderId) {
        const sql = `
            UPDATE order_detail
            SET deleted_at = now()
            WHERE id = $1
        `;
        await query(sql, [orderId]);
    }
}

export default new OrderRepository();
