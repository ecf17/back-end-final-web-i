import categoryRepository from "./CategoryRepository.js";

class CategoryService {
    async createCategory(data) {
        return await categoryRepository.createCategory(data);
    }

    async getAllCategories() {
        return await categoryRepository.getAllCategories();
    }

    async updateCategory(id, data) {
        return await categoryRepository.updateCategory(id, data);
    }

    async deleteCategory(id) {
        await categoryRepository.deleteCategory(id);
    }
}

export default new CategoryService();
