import api from "@/lib/api/index";

export const CurationCallApi = {
  async createCurationCall(data: any) {
    return await api.post("/curation-call", data);
  },
  async updateCurationCall(id: string, data: any) {
    return await api.patch(`/curation-call/${id}`, data);
  },
  async deleteCurationCall(id: string) {
    return await api.delete(`/curation-call/${id}`);
  },
  async getCurationCalls() {
    return await api.get("/curation-call");
  },
  async getCurationCall(id: string) {
    return await api.get(`/curation-call/${id}`);
  },
};
