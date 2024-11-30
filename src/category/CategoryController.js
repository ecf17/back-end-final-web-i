import categoryService from "./CategoryService.js";
import { handleRequest } from '../core/utils/handleRequest.js';

class CategoryController {
    async create(req, res) {
        await handleRequest(async (categoryData) => {
            const category = await categoryService.createCategory(categoryData);
            return { message: "Category created successfully", data: category };
        }, [req.body], res);
    }

    async getAll(req, res) {
        await handleRequest(async () => {
            const categories = await categoryService.getAllCategories();
            return { message: "Categories retrieved successfully", data: categories };
        }, [], res);
    }

    async update(req, res) {
        await handleRequest(async (categoryId, categoryData) => {
            const category = await categoryService.updateCategory(categoryId, categoryData);
            return { message: "Category updated successfully", data: category };
        }, [req.params.id, req.body], res);
    }

    async delete(req, res) {
        await handleRequest(async (categoryId) => {
            await categoryService.deleteCategory(categoryId);
            return { message: "Category deleted successfully" };
        }, [req.params.id], res);
    }
}

export default new CategoryController();