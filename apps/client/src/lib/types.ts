import { CustomerStatus } from "@/lib/utils";

export type CustomerDto = {
  company: string;
  head: string;
  contactNumber: string;
  status: CustomerStatus;
  contractDate: string;
  service: string;
  payment: string;
  ownersBirthday: string;
  companyEstablishmentDate: string;
  curator: string;
  contractExpirationDate: string;
  termsOfPayment: string;
  terminationReason: string;
  position: string;
  source: string;
  notes: string;
};

export type CustomerProps = {
  company: string;
  head: string;
  contactNumber: string;
  status: CustomerStatus;
  contractDate: string | null;
  service: string | null;
  payment: string | null;
  ownersBirthday: string | null;
  companyEstablishmentDate: string | null;
  curator: string | null;
  contractExpirationDate: string | null;
  termsOfPayment: string | null;
  terminationReason: string | null;
  position: string | null;
  source: string | null;
  notes: string | null;
};
export type UserDto = {
  firstName: string;
  lastName: string;
  fatherName: string;
  password: string;
  repeatPassword: string;
  phoneNumber: string;
  email: string;
  gender: Gender;
};

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
}
