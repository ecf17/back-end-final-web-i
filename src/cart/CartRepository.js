import Cart from "./Cart.js";
import CartItem from "./CartItem.js";
import query from "../core/config/dbConfig.js";

class CartRepository {
    async createCart({ userId = null, sessionId = null }) {
        const sql = `
            INSERT INTO cart (user_id, session_id, total, created_at, updated_at)
            VALUES ($1, $2, 0, now(), now())
            RETURNING *
        `;
        const result = await query(sql, [userId, sessionId]);
        return new Cart(result.rows[0]);
    }

    async getCartBySessionId(sessionId) {
        const sql = `
            SELECT * FROM cart WHERE session_id = $1 AND deleted_at IS NULL
        `;
        const result = await query(sql, [sessionId]);
        return result.rows.length ? new Cart(result.rows[0]) : null;
    }

    async getCartByUserId(userId) {
        const sql = `
            SELECT * FROM cart WHERE user_id = $1 AND deleted_at IS NULL
        `;
        const result = await query(sql, [userId]);
        return result.rows.length ? new Cart(result.rows[0]) : null;
    }

    async addItemToCart(cartId, productId, quantity, subtotal) {
        const sql = `
            INSERT INTO cart_item (cart_id, product_id, quantity, subtotal, created_at, updated_at)
            VALUES ($1, $2, $3, $4, now(), now())
            ON CONFLICT (cart_id, product_id) DO UPDATE
                SET quantity = cart_item.quantity + $3,
                    subtotal = cart_item.subtotal + $4,
                    updated_at = now()
            RETURNING *
        `;
        const result = await query(sql, [cartId, productId, quantity, subtotal]);
        return new CartItem(result.rows[0]);
    }

    async getCartItems(cartId) {
        const sql = `
            SELECT * FROM cart_item WHERE cart_id = $1 AND deleted_at IS NULL
        `;
        const result = await query(sql, [cartId]);
        console.log("Cart items for cart ID", cartId, ":", result.rows);
        return result.rows.map(row => new CartItem(row));
    }

    async deleteCartItem(cartItemId) {
        const sql = `
            UPDATE cart_item
            SET deleted_at = now()
            WHERE id = $1
        `;
        await query(sql, [cartItemId]);
    }

    async updateCartTotal(cartId) {
        const sql = `
            UPDATE cart
            SET total = (SELECT COALESCE(SUM(subtotal), 0) FROM cart_item WHERE cart_id = $1 AND deleted_at IS NULL),
                updated_at = now()
            WHERE id = $1
        `;
        await query(sql, [cartId]);
    }

    async clearCart(cartId) {
        const clearCartItemsSql = `
            UPDATE cart_item
            SET deleted_at = now()
            WHERE cart_id = $1
        `;

        const clearCartSql = `
            UPDATE cart
            SET deleted_at = now()
            WHERE id = $1
        `;

        await query(clearCartItemsSql, [cartId]);
        await query(clearCartSql, [cartId]);
    }

    async updateItemQuantityByProductId(cartId, productId, quantity) {
        const sql = `
            UPDATE cart_item
            SET quantity = $3::integer,
                subtotal = $3::integer * (SELECT price::numeric FROM product WHERE id = $2),
                updated_at = now()
            WHERE cart_id = $1 AND product_id = $2 AND deleted_at IS NULL
        `;
        await query(sql, [cartId, productId, quantity]);
    }

    async deleteItemByProductId(cartId, productId) {
        const sql = `
            UPDATE cart_item
            SET deleted_at = now()
            WHERE cart_id = $1 AND product_id = $2 AND deleted_at IS NULL
        `;
        await query(sql, [cartId, productId]);
    }

    async getCartById(cartId) {
        const sql = `
        SELECT * FROM cart 
        WHERE id = $1 AND deleted_at IS NULL
    `;
        const result = await query(sql, [cartId]);
        return result.rows.length ? new Cart(result.rows[0]) : null;
    }

    async getCartItemByProductId(cartId, productId) {
        const sql = `
        SELECT * FROM cart_item 
        WHERE cart_id = $1 AND product_id = $2 AND deleted_at IS NULL
    `;
        const result = await query(sql, [cartId, productId]);

        return result.rows.length ? new CartItem(result.rows[0]) : null;
    }
}

export default new CartRepository();
