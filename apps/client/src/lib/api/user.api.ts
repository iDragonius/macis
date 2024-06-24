import api from "@/lib/api/index";

export const UserApi = {
  async me() {
    return await api.get("/user/me");
  },

  async getAllUsers() {
    return await api.get("/user");
  },

  async createUser(data: any) {
    return await api.post("/user", data);
  },
  async deleteUser(id: string) {
    return await api.delete(`/user/${id}`);
  },
};
