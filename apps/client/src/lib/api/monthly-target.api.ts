import api from "@/lib/api/index";

export const MonthlyTargetApi = {
  async createMonthlyTarget(data: any) {
    return await api.post("monthly-target", data);
  },
  async getAllMonthlyTargets() {
    return await api.get("monthly-target");
  },
};
