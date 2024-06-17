import api from "@/lib/api/index";

export type SignInDto = {
  email: string;
  password: string;
};
export const AuthApi = {
  async signIn(data: SignInDto) {
    return await api.post<{ accessToken: string; refreshToken: string }>(
      `/auth/sign-in`,
      data,
    );
  },
  async signUp() {
    return await api.post(`/auth/sign-up`);
  },
};
