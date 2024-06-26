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
type CallDto = {
  customerId: string | null;
  contactDate: string;
  notes: string;
  result: CallResultType;
  reasonForRejection: string;
  nextContactDate: string;
};
export default function CallEditPage({ params }: { params: { id: string } }) {
  const { data: customers } = useQuery({
    queryKey: ["customers"],
    queryFn: CustomerApi.getAllCustomers,
  });
  const { data: call } = useQuery({
    queryKey: ["call", params.id],
    queryFn: () => CallScheduleApi.getCall(params.id),
  });

  const [data, setData] = useState<CallDto>({
    customerId: null,
    contactDate: "",
    notes: "",
    result: "UNKNOWN",
    reasonForRejection: "",
    nextContactDate: "",
  });
  useEffect(() => {
    if (call) {
      setData({
        customerId: call.data.customer.id,
        contactDate: dayjs(call.data.contactDate).format("YYYY-MM-DD"),
        notes: call.data.notes,
        result: call.data.result,
        reasonForRejection: call.data.reasonForRejection,
        nextContactDate: dayjs(call.data.nextContactDate).format("YYYY-MM-DD"),
      });
    }
  }, [call]);

  const { push } = useRouter();
  function save() {
    if (data.result === "UNKNOWN" || data.result === "WILL_BE_MEETING") {
      CallScheduleApi.updateCall(
        {
          customerId: data.customerId,
          contactDate: data.contactDate,
          notes: data.notes,
        },
        params.id,
      ).then((res) => {
        push("/call-schedule");
      });
    } else if (data.result === "REFUSED") {
      CallScheduleApi.updateCall(
        {
          customerId: data.customerId,
          contactDate: data.contactDate,
          notes: data.notes,
          reasonForRejection: data.reasonForRejection,
        },
        params.id,
      ).then((res) => {
        push("/call-schedule/refused");
      });
    } else {
      CallScheduleApi.updateCall(
        {
          customerId: data.customerId,
          contactDate: data.contactDate,
          notes: data.notes,
          nextContactDate: data.nextContactDate,
        },
        params.id,
      ).then((res) => {
        push("/call-schedule/will-be-followed");
      });
    }
  }

  return (
    <div>
      <PageTitle>Zəng məlumatlarını dəyiş</PageTitle>

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
              </div>
            </>
          )}
          {data.result === "WILL_BE_MEETING" && <></>}
        </>
      </div>

      <Button className={"mt-8 float-right"} onClick={save}>
        Yadda saxla
      </Button>
    </div>
  );
}
