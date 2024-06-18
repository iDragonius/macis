import api from "@/lib/api/index";
import { CustomerDto, CustomerProps } from "@/lib/types";

export const CustomerApi = {
  async getAllCustomers() {
    return await api.get("/customer");
  },
  async getActiveCustomers() {
    return await api.get("/customer", {
      params: {
        status: "ACTIVE",
      },
    });
  },
  async getPotentialCustomers() {
    return await api.get("/customer", {
      params: {
        status: "POTENTIAL",
      },
    });
  },
  async getLostCustomers() {
    return await api.get("/customer", {
      params: {
        status: "LOST",
      },
    });
  },
  async createCustomer(data: any) {
    return await api.post("/customer", data);
  },
  async getCustomer(id: string) {
    return await api.get<CustomerProps>(`/customer/${id}`);
  },
};
