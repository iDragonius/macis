import api from "@/lib/api/index";
export type CallResultType =
  | "REFUSED"
  | "WILL_BE_MEETING"
  | "WILL_BE_FOLLOWED"
  | "UNKNOWN";

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
  async changeCallResult(result: CallResultType | null, callId: string) {
    return await api.patch(`/call-schedule/result/${callId}`, {
      result,
    });
  },
};
