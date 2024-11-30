import query from "../core/config/dbConfig.js";
import User from "./User.js";

class UserRepository {
    async createUser(userData) {
        const sql = `
            INSERT INTO "user" (first_name, last_name, email, password) 
            VALUES ($1, $2, $3, $4) RETURNING id, first_name, last_name, email
        `;
        const result = await query(sql, [
            userData.first_name,
            userData.last_name,
            userData.email,
            userData.password,
        ]);
        return result.rows.length ? new User(result.rows[0]) : null;
    }

    async getUserByEmail(email) {
        const sql = `
            SELECT u.*, r.name AS role
            FROM "user" u
                     LEFT JOIN role r ON u.role_id = r.id
            WHERE u.email = $1
        `;
        const result = await query(sql, [email]);
        return result.rows.length ? new User(result.rows[0]) : null;
    }

    async updateUser(userId, updatedData) {
        const fields = [];
        const values = [];
        let index = 1;

        for (const [key, value] of Object.entries(updatedData)) {
            fields.push(`${key} = $${index}`);
            values.push(value);
            index++;
        }

        values.push(userId);
        const sql = `UPDATE "user" SET ${fields.join(', ')} WHERE id = $${index} RETURNING *`;
        const result = await query(sql, values);
        return result.rows.length ? new User(result.rows[0]) : null;
    }

    async getUserById(userId) {
    const sql = `
        SELECT u.*, r.name AS role
        FROM "user" u
        LEFT JOIN role r ON u.role_id = r.id
        WHERE u.id = $1 AND u.deleted_at IS NULL
    `;
    const result = await query(sql, [userId]);
    return result.rows.length ? new User(result.rows[0]) : null;
}
}

export default new UserRepository();
