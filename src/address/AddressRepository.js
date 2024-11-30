import Address from "./Address.js";
import query from "../core/config/dbConfig.js";

class AddressRepository {
    async getAddressesByUser(userId) {
        const sql = 'SELECT * FROM address WHERE user_id = $1 AND deleted_at IS NULL';
        const result = await query(sql, [userId]);
        return result.rows.map(row => new Address(row));
    }

    async createAddress(userId, addressData) {
        const sql = `
            INSERT INTO address (user_id, address_line, city, country)
            VALUES ($1, $2, $3, $4) RETURNING *
        `;
        const result = await query(sql, [
            userId,
            addressData.address_line,
            addressData.city,
            addressData.country,
        ]);
        return new Address(result.rows[0]);
    }

    async updateAddress(addressId, updatedData) {
        const fields = [];
        const values = [];
        let index = 1;

        for (const [key, value] of Object.entries(updatedData)) {
            fields.push(`${key} = $${index}`);
            values.push(value);
            index++;
        }

        values.push(addressId);
        const sql = `UPDATE address SET ${fields.join(', ')} WHERE id = $${index} AND deleted_at IS NULL RETURNING *`;
        const result = await query(sql, values);
        return new Address(result.rows[0]);
    }

    async deleteAddress(addressId) {
        const sql = 'UPDATE address SET deleted_at = now() WHERE id = $1';
        await query(sql, [addressId]);
    }
}

export default new AddressRepository();