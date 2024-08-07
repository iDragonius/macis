import api from "@/lib/api/index";

export const ReportApi = {
  async getReportByPeriodOfTime(
    period: "day" | "week" | "month" | "year",
    managerId: string,
  ) {
    return await api.get(`/report/${managerId}`, {
      params: { period },
    });
  },
};
