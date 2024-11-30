class Product {
    constructor({ id, name, description, price, stock, category_id, created_at, updated_at, deleted_at, images = [], is_featured }) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.stock = stock;
        this.category_id = category_id;
        this.created_at = created_at;
        this.is_featured = is_featured;
        this.updated_at = updated_at;
        this.deleted_at = deleted_at;
        this.images = images;
    }
}

export default Product;
