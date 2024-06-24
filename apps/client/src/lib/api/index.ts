import axios from "axios";
import toast from "react-hot-toast";
import { ErrorMessages } from "@/lib/error-messages";
import { FieldErrorMessages } from "@/lib/field-error-messages";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    if (localStorage.getItem("token")) {
      config.headers.Authorization = "Bearer " + localStorage.getItem("token");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.data.createdBy === "ValidationFilter") {
      error.response.data.validationErrors.map(
        (error: { field: string; message: string }) => {
          toast.error(
            FieldErrorMessages[error.field][error.message] ||
              "Gözlənilməyən xəta baş verdi!",
          );
        },
      );
    } else {
      if (error.response.status === 403) {
        toast.error("Bu resursa icazəniz yoxdur!");
      } else {
        toast.error(
          ErrorMessages[error.response.data.message] ||
            "Gözlənilməyən xəta baş verdi!",
        );
      }
    }
    return Promise.reject(error);
  },
);

export default api;
