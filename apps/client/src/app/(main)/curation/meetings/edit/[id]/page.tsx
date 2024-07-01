"use client";
import { useQuery } from "@tanstack/react-query";
import { CustomerApi } from "@/lib/api/customer.api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
import { formatInputDate } from "@/lib/utils";
import { CurationMeetingApi } from "@/lib/api/curation-meeting.api";
type CurationMeetingDto = {
  customerId: string | null;
  meetingTime: string;
  meetingDate: string;
  notes: string;
  customerFeedback: string;
  customerRequests: string;
  nuances: string;
  referenceCompanies: string;
};

export default function Page({ params }: { params: { id: string } }) {
  const { data: customers } = useQuery({
    queryKey: ["customers"],
    queryFn: CustomerApi.getAllCustomers,
  });

  const { data: curationMeeting } = useQuery({
    queryKey: ["curation-meeting", params.id],
    queryFn: () => CurationMeetingApi.getCurationMeeting(params.id),
  });
  const { push } = useRouter();
  const [data, setData] = useState<CurationMeetingDto>({
    customerId: null,
    customerFeedback: "",
    meetingDate: "",
    customerRequests: "",
    notes: "",
    nuances: "",
    referenceCompanies: "",
    meetingTime: "",
  });
  useEffect(() => {
    if (curationMeeting) {
      setData({
        customerId: curationMeeting.data.customerId,
        customerFeedback: curationMeeting.data.customerFeedback,
        customerRequests: curationMeeting.data.customerRequests,
        meetingDate: formatInputDate(curationMeeting.data.meetingDate),
        notes: curationMeeting.data.notes,
        referenceCompanies: curationMeeting.data.referenceCompanies,
        nuances: curationMeeting.data.nuances,
        meetingTime: curationMeeting.data.meetingTime,
      });
    }
  }, [curationMeeting]);

  function save() {
    CurationMeetingApi.updateCurationMeeting(params.id, data).then((res) => {
      toast.success("Kurasiya  görüşü uğurla dəyişdirildi");
      push("/curation/meetings");
    });
  }
  return (
    <div>
      <PageTitle>Kurasiya görüşünü dəyiş</PageTitle>
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
          <Label>Görüş vaxtı</Label>
          <Input
            value={data.meetingTime}
            onChange={(e) =>
              setData((prevState) => ({
                ...prevState,
                meetingTime: e.target.value,
              }))
            }
            type={"text"}
            placeholder={"Görüş vaxtı"}
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
          <Label>Narazı olduğu bir nüans varmı</Label>
          <Textarea
            value={data.nuances}
            onChange={(e) =>
              setData((prevState) => ({
                ...prevState,
                nuances: e.target.value,
              }))
            }
            placeholder={"Narazı olduğu bir nüans varmı"}
          />
        </div>{" "}
        <div>
          <Label>Bizi referans etdiyi şirkətlər</Label>
          <Textarea
            value={data.referenceCompanies}
            onChange={(e) =>
              setData((prevState) => ({
                ...prevState,
                referenceCompanies: e.target.value,
              }))
            }
            placeholder={"Bizi referans etdiyi şirkətlər"}
          />
        </div>{" "}
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
