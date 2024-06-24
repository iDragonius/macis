import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";
import { Role } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string): string {
  return dayjs(date).format("DD.MM.YYYY");
}

export type CustomerStatus = "ACTIVE" | "POTENTIAL" | "LOST";
export function getCustomerStatus(status: CustomerStatus): string {
  if (status === "ACTIVE") {
    return "Aktiv";
  } else if (status === "LOST") {
    return "İtirilmiş";
  } else {
    return "Potensial";
  }
}

export function formatField(field: any | null) {
  if (field === null) {
    return "Təyin edilməyib";
  } else {
    return field;
  }
}

export function getRole(role: Role): string {
  if (role === "USER") {
    return "İzləyici";
  } else if (role === "ADMIN") {
    return "Admin";
  } else {
    return "Super Admin";
  }
}
