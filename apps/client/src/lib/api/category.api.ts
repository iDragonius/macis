import api from "@/lib/api/index";

export const CategoryApi = {
  async getAllCategories() {
    return await api.get("/category");
  },
  async createCategory(name: string) {
    return await api.post("/category", { name });
  },
  async deleteCategory(id: string) {
    return await api.delete(`/category/${id}`);
  },
};
