"use client";
import { PageTitle } from "@/components/ui/page-title";
import { useQuery } from "@tanstack/react-query";
import { CustomerApi } from "@/lib/api/customer.api";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { CallScheduleApi } from "@/lib/api/call-schedule.api";
import MeetingSchedule from "@/app/(main)/meeting-schedule/page";
import { MeetingScheduleApi } from "@/lib/api/meeting-schedule.api";

type MeetingDto = {
  customerId: string | null;
  contactDate: string;
  meetingDate: string;
  notes: string;
};
export default function Add() {
  const { data: customers } = useQuery({
    queryKey: ["customers"],
    queryFn: CustomerApi.getAllCustomers,
  });

  const [data, setData] = useState<MeetingDto>({
    customerId: null,
    contactDate: "",
    notes: "",
    meetingDate: "",
  });
  const { push } = useRouter();
  function save() {
    MeetingScheduleApi.createMeeting(data).then((res) => {
      push("/meeting-schedule");
    });
  }

  return (
    <div>
      <PageTitle>Yeni zəng</PageTitle>
      <div className={"mt-5 grid grid-cols-2 gap-8"}>
        <div>
          <Label>Müştərini seçin</Label>
          <Select
            onValueChange={(value) =>
              setData((prevState) => ({
                ...prevState,
                customerId: value,
              }))
            }
            value={data.customerId || undefined}
          >
            <SelectTrigger>
              <SelectValue placeholder="Müştəri" />
            </SelectTrigger>
            <SelectContent>
              {customers?.data.map((customer: any) => {
                return (
                  <SelectItem value={customer.id}>
                    {customer.company}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Əlaqə tarixi</Label>
          <Input
            value={data.contactDate}
            onChange={(e) =>
              setData((prevState) => ({
                ...prevState,
                contactDate: e.target.value,
              }))
            }
            type={"date"}
            placeholder={"Əlaqə tarixi"}
          />
        </div>
        <div>
          <Label>Görüş tarixi</Label>
          <Input
            value={data.meetingDate}
            onChange={(e) =>
              setData((prevState) => ({
                ...prevState,
                meetingDate: e.target.value,
              }))
            }
            type={"date"}
            placeholder={"Görüş tarixi"}
          />
        </div>
        <div>
          <Label>Qeydlər</Label>
          <Textarea
            value={data.notes}
            onChange={(e) =>
              setData((prevState) => ({
                ...prevState,
                notes: e.target.value,
              }))
            }
            placeholder={"Qeydlər "}
          />
        </div>
      </div>
      <Button className={"mt-8 float-right"} onClick={save}>
        Yadda saxla
      </Button>
    </div>
  );
}
