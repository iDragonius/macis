import { CustomerStatus } from "@/lib/utils";
import { Customer } from "@/app/(main)/customers/page";
import { CallResultType } from "@/lib/api/call-schedule.api";
import { MeetingResultType } from "@/lib/api/meeting-schedule.api";

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
  role: Role;
};

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
}

export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
}

export enum MeetingResult {
  CONTRACT_SIGNED = "CONTRACT_SIGNED",
  WILL_BE_FOLLOWED = "WILL_BE_FOLLOWED",
  REFUSED = "REFUSED",
  UNKNOWN = "UNKNOWN",
}

export enum CallResult {
  WILL_BE_MEETING = "WILL_BE_MEETING",
  WILL_BE_FOLLOWED = "WILL_BE_FOLLOWED",
  REFUSED = "REFUSED",
  UNKNOWN = "UNKNOWN",
}

export type CallProps = {
  id: string;
  customer: Customer;
  contactDate: string;
  nextContactDate: string;
  reasonForRejection: string;
  notes: string;
  result: CallResultType;
};

export type MeetingProps = {
  id: string;
  customer: Customer;
  contactDate: string;
  meetingTime: string;
  meetingDate: string;
  nextContactDate: string;
  nextMeetingDate: string;
  reasonForRejection: string;
  notes: string;
  result: MeetingResultType;
};
