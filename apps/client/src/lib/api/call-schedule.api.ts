import api from "@/lib/api/index";
import { MeetingResultType } from "@/lib/api/meeting-schedule.api";
export type CallResultType =
  | "REFUSED"
  | "WILL_BE_MEETING"
  | "WILL_BE_FOLLOWED"
  | "UNKNOWN";
export const CallTypes: Record<string, CallResultType> = {
  refused: "REFUSED",
  "will-be-meeting": "WILL_BE_MEETING",
  "will-be-followed": "WILL_BE_FOLLOWED",
};
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
  async updateCall(data: any, id: string) {
    return await api.put(`/call-schedule/${id}`, data);
  },
  async changeCallResult(result: CallResultType | null, callId: string) {
    return await api.patch(`/call-schedule/result/${callId}`, {
      result,
    });
  },
  async getCall(id: string) {
    return await api.get(`/call-schedule/${id}`);
  },
};
