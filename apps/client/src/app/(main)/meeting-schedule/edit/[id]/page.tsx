"use client";
import { useQuery } from "@tanstack/react-query";
import { CallResultType, CallScheduleApi } from "@/lib/api/call-schedule.api";
import { PageTitle } from "@/components/ui/page-title";
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
import { useEffect, useState } from "react";
import { CustomerApi } from "@/lib/api/customer.api";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import {
  MeetingResultType,
  MeetingScheduleApi,
} from "@/lib/api/meeting-schedule.api";
import { formatInputDate } from "@/lib/utils";
type MeetingDto = {
  customerId: string | null;
  contactDate: string;
  meetingDate: string;
  notes: string;
  result: MeetingResultType;
  reasonForRejection: string;
  nextContactDate: string;
  nextMeetingDate: string;
  meetingTime: string;
};
export default function CallEditPage({ params }: { params: { id: string } }) {
  const { data: customers } = useQuery({
    queryKey: ["customers"],
    queryFn: CustomerApi.getAllCustomers,
  });
  const { data: meeting } = useQuery({
    queryKey: ["meeting", params.id],
    queryFn: () => MeetingScheduleApi.getMeeting(params.id),
  });

  const [data, setData] = useState<MeetingDto>({
    customerId: null,
    contactDate: "",
    notes: "",
    result: "UNKNOWN",
    reasonForRejection: "",
    nextContactDate: "",
    nextMeetingDate: "",
    meetingDate: "",
    meetingTime: "",
  });
  useEffect(() => {
    if (meeting) {
      setData({
        customerId: meeting.data.customer.id,
        contactDate: formatInputDate(meeting.data.contactDate),
        notes: meeting.data.notes,
        result: meeting.data.result,
        reasonForRejection: meeting.data.reasonForRejection,
        nextContactDate: formatInputDate(meeting.data.nextContactDate),
        nextMeetingDate: formatInputDate(meeting.data.nextMeetingDate),
        meetingTime: meeting.data.meetingTime,
        meetingDate: formatInputDate(meeting.data.meetingDate),
      });
    }
  }, [meeting]);

  const { push } = useRouter();
  function save() {
    if (data.result === "UNKNOWN" || data.result === "CONTRACT_SIGNED") {
      MeetingScheduleApi.updateMeeting(
        {
          customerId: data.customerId,
          contactDate: data.contactDate,
          notes: data.notes,
          meetingTime: data.meetingTime,
        },
        params.id,
      ).then((res) => {
        push("/meeting-schedule");
      });
    } else if (data.result === "REFUSED") {
      MeetingScheduleApi.updateMeeting(
        {
          customerId: data.customerId,
          meetingDate: data.meetingDate,
          notes: data.notes,
          reasonForRejection: data.reasonForRejection,
          meetingTime: data.meetingTime,
        },
        params.id,
      ).then((res) => {
        push("/meeting-schedule/refused");
      });
    } else {
      MeetingScheduleApi.updateMeeting(
        {
          customerId: data.customerId,
          contactDate: data.contactDate,
          notes: data.notes,
          nextContactDate: data.nextContactDate,
          meetingTime: data.meetingTime,
          nextMeetingDate: data.nextMeetingDate,
        },
        params.id,
      ).then((res) => {
        push("/meeting-schedule/will-be-followed");
      });
    }
  }

  return (
    <div>
      <PageTitle>Görüş məlumatlarını dəyiş</PageTitle>

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
                  <SelectItem value={customer.id} key={customer.id}>
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
        </div>{" "}
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
            placeholder={"Əlaqə tarixi"}
          />
        </div>{" "}
        <div>
          <Label>Görüş saatı</Label>
          <Input
            value={data.meetingTime}
            onChange={(e) =>
              setData((prevState) => ({
                ...prevState,
                meetingTime: e.target.value,
              }))
            }
            type={"text"}
            placeholder={"Görüş saatı"}
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
        <>
          {data.result === "UNKNOWN" && <></>}
          {data.result === "REFUSED" && (
            <>
              <div>
                <Label>Rədd etmə səbəbi</Label>
                <Textarea
                  placeholder={"Rədd etmə səbəbi"}
                  value={data.reasonForRejection}
                  onChange={(e) =>
                    setData((prevState) => ({
                      ...prevState,
                      reasonForRejection: e.target.value,
                    }))
                  }
                />
              </div>
            </>
          )}
          {data.result === "WILL_BE_FOLLOWED" && (
            <>
              <div>
                <Label>Növbəti əlaqə tarixi</Label>
                <Input
                  value={data.nextContactDate}
                  onChange={(e) =>
                    setData((prevState) => ({
                      ...prevState,
                      nextContactDate: e.target.value,
                    }))
                  }
                  type={"date"}
                  placeholder={"Növbəti əlaqə tarixi"}
                />
              </div>{" "}
              <div>
                <Label>Növbəti görüş tarixi</Label>
                <Input
                  value={data.nextMeetingDate}
                  onChange={(e) =>
                    setData((prevState) => ({
                      ...prevState,
                      nextMeetingDate: e.target.value,
                    }))
                  }
                  type={"date"}
                  placeholder={"Növbəti görüş tarixi"}
                />
              </div>
            </>
          )}
          {data.result === "CONTRACT_SIGNED" && <></>}
        </>
      </div>

      <Button className={"mt-8 float-right"} onClick={save}>
        Yadda saxla
      </Button>
    </div>
  );
}
