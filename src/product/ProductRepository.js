import Product from "./Product.js";
import query from "../core/config/dbConfig.js";

class ProductRepository {
    async getAllProducts(limit = 10, offset = 0) {
        const sql = `
            SELECT p.*,
                   c.name AS category_name,
                   JSON_AGG(JSON_BUILD_OBJECT('id', i.id, 'image_url', i.image_url)) AS images
            FROM product p
                     LEFT JOIN category c ON c.id = p.category_id
                     LEFT JOIN image i ON i.entity_id = p.id AND i.entity_type = 'product' AND i.deleted_at IS NULL
            WHERE p.deleted_at IS NULL
            GROUP BY p.id, c.name
            LIMIT $1 OFFSET $2
        `;
        const result = await query(sql, [limit, offset]);
        return result.rows.map(row => {
            const product = new Product(row);
            product.category_name = row.category_name;
            return product;
        });
    }

    async getProductsByCategory(categoryId, limit = 10, offset = 0) {
        const sql = `
            SELECT p.*,
                   c.name AS category_name,
                   JSON_AGG(JSON_BUILD_OBJECT('id', i.id, 'image_url', i.image_url)) AS images
            FROM product p
                     LEFT JOIN category c ON c.id = p.category_id
                     LEFT JOIN image i ON i.entity_id = p.id AND i.entity_type = 'product' AND i.deleted_at IS NULL
            WHERE p.category_id = $1 AND p.deleted_at IS NULL
            GROUP BY p.id, c.name
            LIMIT $2 OFFSET $3
        `;
        const result = await query(sql, [categoryId, limit, offset]);
        return result.rows.map(row => {
            const product = new Product(row);
            product.category_name = row.category_name;
            return product;
        });
    }

    async getProductById(id) {
        const sql = `
            SELECT p.*,
                   c.name AS category_name,
                   JSON_AGG(JSON_BUILD_OBJECT('id', i.id, 'image_url', i.image_url)) AS images
            FROM product p
                     LEFT JOIN category c ON c.id = p.category_id
                     LEFT JOIN image i ON i.entity_id = p.id AND i.entity_type = 'product' AND i.deleted_at IS NULL
            WHERE p.id = $1 AND p.deleted_at IS NULL
            GROUP BY p.id, c.name
        `;
        const result = await query(sql, [id]);
        if (result.rows.length) {
            const product = new Product(result.rows[0]);
            product.category_name = result.rows[0].category_name;
            return product;
        }
        return null;
    }

    async createProduct(data) {
        const sql = `
            INSERT INTO product (name, description, price, stock, category_id)
            VALUES ($1, $2, $3, $4, $5) RETURNING *
        `;
        const result = await query(sql, [
            data.name,
            data.description,
            data.price,
            data.stock,
            data.category_id,
        ]);
        return new Product(result.rows[0]);
    }

    async addImagesToProduct(productId, imageUrls) {
        const values = imageUrls.map(url => `('${productId}', 'product', '${url}')`).join(', ');
        const sql = `
            INSERT INTO image (entity_id, entity_type, image_url) 
            VALUES ${values}
        `;
        await query(sql);
    }

    async deleteProduct(id) {
        const updateProductSql = `
            UPDATE product
            SET deleted_at = now()
            WHERE id = $1
        `;
        const updateImageSql = `
            UPDATE image
            SET deleted_at = now()
            WHERE entity_id = $1 AND entity_type = 'product'
        `;

        await query(updateProductSql, [id]);
        await query(updateImageSql, [id]);
    }

    async updateProduct(id, data) {
        const fields = [];
        const values = [];
        let index = 1;

        // Agregar solo los campos que tienen valores proporcionados
        for (const [key, value] of Object.entries(data)) {
            fields.push(`${key} = $${index}`);
            values.push(value);
            index++;
        }

        values.push(id); // ID del producto para la cláusula WHERE

        const sql = `
            UPDATE product
            SET ${fields.join(", ")}, updated_at = NOW()
            WHERE id = $${index} AND deleted_at IS NULL
            RETURNING *
        `;

        const result = await query(sql, values);
        return result.rows.length ? new Product(result.rows[0]) : null;
    }

    async deleteImage(imageId) {
        const sql = `
            UPDATE image 
            SET deleted_at = now() 
            WHERE id = $1
        `;
        await query(sql, [imageId]);
    }

    async updateIsFeatured(productId, isFeatured) {
        const sql = `
            UPDATE product
            SET is_featured = $2, updated_at = NOW()
            WHERE id = $1 AND deleted_at IS NULL
            RETURNING *
        `;
        const result = await query(sql, [productId, isFeatured]);
        return result.rows.length ? new Product(result.rows[0]) : null;
    }

    async getFeaturedProducts(limit = 10, offset = 0) {
        const sql = `
            SELECT p.*,
                   c.name AS category_name,
                   JSON_AGG(JSON_BUILD_OBJECT('id', i.id, 'image_url', i.image_url)) AS images
            FROM product p
                     LEFT JOIN category c ON c.id = p.category_id
                     LEFT JOIN image i ON i.entity_id = p.id AND i.entity_type = 'product' AND i.deleted_at IS NULL
            WHERE p.is_featured = TRUE AND p.deleted_at IS NULL
            GROUP BY p.id, c.name
            LIMIT $1 OFFSET $2
        `;
        const result = await query(sql, [limit, offset]);
        return result.rows.map(row => {
            const product = new Product(row);
            product.category_name = row.category_name;
            return product;
        });
    }

}

export default new ProductRepository();