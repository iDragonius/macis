import api from "@/lib/api/index";
import { CallResultType } from "@/lib/api/call-schedule.api";
export type MeetingResultType =
  | "REFUSED"
  | "CONTRACT_SIGNED"
  | "WILL_BE_FOLLOWED"
  | "UNKNOWN";

export const MeetingScheduleApi = {
  async getAllMeetings(result: MeetingResultType | null) {
    return await api.get("/meeting-schedule", {
      params: {
        result,
      },
    });
  },
  async getDailyMeetingSchedule() {
    return await api.get("/meeting-schedule/daily");
  },
  async createMeeting(data: any) {
    return await api.post("/meeting-schedule", data);
  },
  async changeMeetingResult(result: MeetingResultType, meetingId: string) {
    return await api.patch(`/meeting-schedule/result/${meetingId}`, {
      result,
    });
  },
};
