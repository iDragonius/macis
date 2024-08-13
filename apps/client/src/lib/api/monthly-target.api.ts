import api from "@/lib/api/index";

export const MonthlyTargetApi = {
  async createMonthlyTarget(data: any) {
    return await api.post("/monthly-target", data);
  },
  async updateMonthlyTarget(data: any, id: string) {
    return await api.patch(`/monthly-target/${id}`, data);
  },
  async getAllMonthlyTargets() {
    return await api.get("/monthly-target");
  },
  async getMonthlyTarget(id: string) {
    return await api.get(`/monthly-target/${id}`);
  },
  async getMonthlyTargetByManager(userId: string) {
    return await api.get(`/monthly-target/manager/${userId}`);
  },
  async deleteMonthlyTarget(id: string) {
    return await api.delete(`/monthly-target/${id}`);
  },
};
