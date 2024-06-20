import api from "@/lib/api/index";
export type CallResultType = "REFUSED" | "WILL_BE_MEETING" | "WILL_BE_FOLLOWED";

export const CallScheduleApi = {
  async getAllCalls(result: CallResultType | null) {
    return await api.get("/call-schedule", {
      params: {
        result,
      },
    });
  },
  async getDailyCallSchedule() {
    return await api.get("/call-schedule/daily");
  },
  async createCall(data: any) {
    return await api.post("/call-schedule", data);
  },
};
