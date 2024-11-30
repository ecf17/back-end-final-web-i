import productRepository from './ProductRepository.js';
import path from "path";

class ProductService {
    async createProduct(data, files) {
        const product = await productRepository.createProduct(data);

        if (files && files.length > 0) {
            const imageNames = files.map(file => path.basename(file.path));
            await productRepository.addImagesToProduct(product.id, imageNames);
        }

        if (data.images && data.images.length) {
            await productRepository.addImagesToProduct(product.id, data.images);
        }

        return product;
    }


    async getAllProducts(limit, offset) {
        return await productRepository.getAllProducts(limit, offset);
    }

    async getProductById(id) {
        return await productRepository.getProductById(id);
    }

    async deleteProduct(id) {
        await productRepository.deleteProduct(id);
    }

    async getProductsByCategory(categoryId, limit, offset) {
        return await productRepository.getProductsByCategory(categoryId, limit, offset);
    }

    async updateProduct(id, data, files) {
        const productData = {};
        for (const [key, value] of Object.entries(data)) {
            if (value !== undefined) {
                productData[key] = value;
            }
        }

        const updatedProduct = await productRepository.updateProduct(id, productData);

        if (files && files.length > 0) {
            const imageNames = files.map(file => path.basename(file.path));
            await productRepository.addImagesToProduct(id, imageNames);
        }

        if (productData.images && productData.images.length > 0) {
            await productRepository.addImagesToProduct(id, productData.images);
        }

        return updatedProduct;
    }


    async deleteImage(imageId) {
        await productRepository.deleteImage(imageId);
    }

    async getFeaturedProducts(limit, offset) {
        return await productRepository.getFeaturedProducts(limit, offset);
    }

    async updateIsFeatured(productId, isFeatured) {
        return await productRepository.updateIsFeatured(productId, isFeatured);
    }

}

export default new ProductService();