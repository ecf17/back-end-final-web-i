import productService from "./ProductService.js";
import { handleRequest } from "../core/utils/handleRequest.js";

class ProductController {
    async create(req, res) {
        await handleRequest(async (productData, files) => {
            const images = files?.map(file => file.path);
            productData = {
                ...productData,
                images,
            };
            const product = await productService.createProduct(productData, files);
            return { message: "Product created successfully", data: product };
        }, [req.body, req.files], res);
    }

    async getAll(req, res) {
        await handleRequest(async (limit, offset) => {
            limit = Number.isInteger(limit) && limit > 0 ? limit : 10;
            offset = Number.isInteger(offset) && offset >= 0 ? offset : 0;

            const products = await productService.getAllProducts(limit, offset);
            return { message: "Products retrieved successfully", data: products };
        }, [parseInt(req.query.limit), parseInt(req.query.offset)], res);
    }


    async getById(req, res) {
        await handleRequest(async (productId) => {
            const product = await productService.getProductById(productId);
            if (!product) throw new Error('Product not found');
            return { message: "Product retrieved successfully", data: product };
        }, [req.params.id], res);
    }

    async update(req, res) {
        await handleRequest(async (productId, productData, files) => {
            const updatedProduct = await productService.updateProduct(productId, productData, files);
            if (!updatedProduct) throw new Error("Product not found or already deleted");
            return { message: "Product updated successfully", data: updatedProduct };
        }, [req.params.id, req.body, req.files], res);
    }

    async delete(req, res) {
        await handleRequest(async (productId) => {
            await productService.deleteProduct(productId);
            return { message: "Product deleted successfully" };
        }, [req.params.id], res);
    }

    async getByCategory(req, res) {
        await handleRequest(async (categoryId, limit, offset) => {
            const products = await productService.getProductsByCategory(categoryId, limit, offset);
            return { message: "Products by category retrieved successfully", data: products };
        }, [req.params.categoryId, parseInt(req.query.limit) || 10, parseInt(req.query.offset) || 0], res);
    }

    async deleteImage(req, res) {
        await handleRequest(async (imageId) => {
            await productService.deleteImage(imageId);
            return { message: "Image deleted successfully" };
        }, [req.params.imageId], res);
    }

    async getFeatured(req, res) {
        await handleRequest(async (limit, offset) => {
            limit = Number.isInteger(limit) && limit > 0 ? limit : 10;
            offset = Number.isInteger(offset) && offset >= 0 ? offset : 0;

            const products = await productService.getFeaturedProducts(limit, offset);
            return { message: "Featured products retrieved successfully", data: products };
        }, [parseInt(req.query.limit), parseInt(req.query.offset)], res);
    }


}

export default new ProductController();