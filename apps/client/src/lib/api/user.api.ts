import api from "@/lib/api/index";

export const UserApi = {
  async me() {
    return await api.get("/user/me");
  },
};
