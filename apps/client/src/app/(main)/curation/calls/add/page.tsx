"use client";
import { PageTitle } from "@/components/ui/page-title";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CustomerApi } from "@/lib/api/customer.api";
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
import { CurationCallApi } from "@/lib/api/curation-call.api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
type CurationCallDto = {
  customerId: string | null;
  callDate: string;
  meetingDate: string;
  notes: string;
  customerFeedback: string;
  customerRequests: string;
};

export default function Page() {
  const { data: customers } = useQuery({
    queryKey: ["customers"],
    queryFn: CustomerApi.getAllCustomers,
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

  function save() {
    CurationCallApi.createCurationCall(data).then((res) => {
      toast.success("Kurasiya  zəngi uğurla yaradıldı");
      push("/curation/calls");
    });
  }

  return (
    <div>
      <PageTitle>Yeni kurasiya zəngi</PageTitle>
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
