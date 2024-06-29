import api from "@/lib/api/index";

export const CurationMeetingApi = {
  async createCurationMeeting(data: any) {
    return await api.post("/curation-meeting", data);
  },
  async updateCurationMeeting(id: string, data: any) {
    return await api.patch(`/curation-meeting/${id}`, data);
  },
  async deleteCurationMeeting(id: string) {
    return await api.delete(`/curation-meeting/${id}`);
  },
  async getCurationMeetings() {
    return await api.get("/curation-meeting");
  },
  async getCurationMeeting(id: string) {
    return await api.get(`/curation-meeting/${id}`);
  },
};
