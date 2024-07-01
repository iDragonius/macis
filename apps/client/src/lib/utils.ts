import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";
import { Role } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string): string {
  if (dayjs(date).isValid()) {
    return dayjs(date).format("DD.MM.YYYY");
  } else {
    return "Məlumat yoxdur";
  }
}

export function formatInputDate(date: string): string {
  if (dayjs(date).isValid()) {
    return dayjs(date).format("YYYY-MM-DD");
  } else {
    return "";
  }
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

export const months = [
  {
    value: "January",
    label: "Yanvar",
  },
  {
    value: "February",
    label: "Fevral",
  },
  {
    value: "March",
    label: "Mart",
  },
  {
    value: "April",
    label: "Aprel",
  },
  {
    value: "May",
    label: "May",
  },
  {
    value: "June",
    label: "İyun",
  },
  {
    value: "July",
    label: "İyul",
  },
  {
    value: "August",
    label: "Avqust",
  },
  {
    value: "September",
    label: "Sentyabr",
  },
  {
    value: "October",
    label: "Oktyabr",
  },
  {
    value: "November",
    label: "Noyabr",
  },
  {
    value: "December",
    label: "Dekabr",
  },
];

export const years = [2024, 2025, 2026, 2027, 2028, 2029, 2030];

export function formatMonth(month: string): string {
  return months.find((el) => el.value === month)?.label || "";
}
