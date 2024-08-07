import api from "@/lib/api/index";

export const UserApi = {
  async me() {
    return await api.get("/user/me");
  },

  async getAllUsers() {
    return await api.get("/user");
  },
  async getAllManagers() {
    return await api.get("/user", {
      params: {
        isManager: true,
      },
    });
  },
  async getUser(id: string) {
    return await api.get(`/user/${id}`);
  },

  async createUser(data: any) {
    return await api.post("/user", data);
  },
  async deleteUser(id: string) {
    return await api.delete(`/user/${id}`);
  },
  async setManagerStatus(status: boolean, userId: string) {
    return await api.patch(`/user/${userId}/manager`, {
      isManager: status,
    });
  },
};
