import api from "@/lib/api/index";
export type MeetingResultType =
  | "REFUSED"
  | "CONTRACT_SIGNED"
  | "WILL_BE_FOLLOWED";

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
};
