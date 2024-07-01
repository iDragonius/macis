"use client";
import { useQuery } from "@tanstack/react-query";
import { CustomerApi } from "@/lib/api/customer.api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CurationCallApi } from "@/lib/api/curation-call.api";
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
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import { formatDate, formatInputDate } from "@/lib/utils";

type CurationCallDto = {
  customerId: string | null;
  callDate: string;
  meetingDate: string;
  notes: string;
  customerFeedback: string;
  customerRequests: string;
};

export default function Page({ params }: { params: { id: string } }) {
  const { data: customers } = useQuery({
    queryKey: ["customers"],
    queryFn: CustomerApi.getAllCustomers,
  });

  const { data: curationCall } = useQuery({
    queryKey: ["curation-call", params.id],
    queryFn: () => CurationCallApi.getCurationCall(params.id),
  });
  const { push } = useRouter();
  const [data, setData] = useState<CurationCallDto>({
    customerId: null,
    callDate: "",
    customerFeedback: "",
    meetingDate: "",
    customerRequests: "",
    notes: "",
  });
  useEffect(() => {
    if (curationCall) {
      setData({
        customerId: curationCall.data.customerId,
        customerFeedback: curationCall.data.customerFeedback,
        customerRequests: curationCall.data.customerRequests,
        callDate: formatInputDate(curationCall.data.callDate),
        meetingDate: formatInputDate(curationCall.data.meetingDate),
        notes: curationCall.data.notes,
      });
    }
  }, [curationCall]);

  function save() {
    CurationCallApi.updateCurationCall(params.id, data).then((res) => {
      toast.success("Kurasiya  zəngi uğurla dəyişdirildi");
      push("/curation/calls");
    });
  }

  return (
    <div>
      <PageTitle>Kurasiya zəngini dəyiş</PageTitle>
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
          <Label>Zəng tarixi</Label>
          <Input
            value={data.callDate}
            onChange={(e) =>
              setData((prevState) => ({
                ...prevState,
                callDate: e.target.value,
              }))
            }
            type={"date"}
            placeholder={"Zəng tarixi"}
          />
        </div>
        <div>
          <Label>Müştəri geridönüşləri </Label>
          <Textarea
            value={data.customerFeedback}
            onChange={(e) =>
              setData((prevState) => ({
                ...prevState,
                customerFeedback: e.target.value,
              }))
            }
            placeholder={"Müştəri geridönüşləri "}
          />
        </div>
        <div>
          <Label>Müştəri istəkləri</Label>
          <Textarea
            value={data.customerRequests}
            onChange={(e) =>
              setData((prevState) => ({
                ...prevState,
                customerRequests: e.target.value,
              }))
            }
            placeholder={"Müştəri istəkləri"}
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
