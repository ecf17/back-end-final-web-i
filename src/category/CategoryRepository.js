import query from "../core/config/dbConfig.js";
import Category from "./Category.js";

class CategoryRepository {
    async createCategory(data) {
        const sql = `
            INSERT INTO category (name, description, created_at, updated_at)
            VALUES ($1, $2, now(), now()) RETURNING *
        `;
        const result = await query(sql, [data.name, data.description]);
        return new Category(result.rows[0]);
    }

    async getAllCategories() {
        const sql = `
            SELECT * FROM category 
            WHERE deleted_at IS NULL
        `;
        const result = await query(sql);
        return result.rows.map(row => new Category(row));
    }

    async updateCategory(id, data) {
        const fields = ['name = $1'];
        const values = [data.name, id];
        let index = 2;

        if (data.description !== undefined) {
            fields.push(`description = $${index}`);
            values.splice(1, 0, data.description);
            index++;
        }

        const sql = `
            UPDATE category
            SET ${fields.join(', ')}, updated_at = now()
            WHERE id = $${index} AND deleted_at IS NULL RETURNING *
        `;
        const result = await query(sql, values);
        return result.rows.length ? new Category(result.rows[0]) : null;
    }

    async deleteCategory(id) {
        const sql = `
            UPDATE category 
            SET deleted_at = now(), updated_at = now() 
            WHERE id = $1
        `;
        await query(sql, [id]);
    }

    async getCategoryById(id) {
        const sql = `
            SELECT * FROM category 
            WHERE id = $1 AND deleted_at IS NULL
        `;
        const result = await query(sql, [id]);
        return result.rows.length ? new Category(result.rows[0]) : null;
    }
}

export default new CategoryRepository();
