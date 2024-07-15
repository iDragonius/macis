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
import { formatInputDate } from "@/lib/utils";
import { CategoryApi } from "@/lib/api/category.api";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { DialogBody } from "next/dist/client/components/react-dev-overlay/internal/components/Dialog";
type CallDto = {
  customerId: string | null;
  categoryId: string | null;
  contactDate: string;
  notes: string;
  result: CallResultType;
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
  const { data: categories, refetch } = useQuery({
    queryKey: ["categories"],
    queryFn: CategoryApi.getAllCategories,
  });
  const [categoryOpen, setCategoryOpen] = useState<boolean>(false);
  const [categoryName, setCategoryName] = useState<string>("");
  const [data, setData] = useState<CallDto>({
    customerId: null,
    contactDate: "",
    notes: "",
    result: "UNKNOWN",
    nextContactDate: "",
    categoryId: null,
  });
  useEffect(() => {
    if (call) {
      setData({
        customerId: call.data.customer.id,
        contactDate: formatInputDate(call.data.contactDate),
        notes: call.data.notes,
        result: call.data.result,

        nextContactDate: formatInputDate(call.data.nextContactDate),
        categoryId: call?.data?.categoryId,
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
          categoryId: data.categoryId,
          contactDate: data.contactDate,
          notes: data.notes,
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
  function saveCategory() {
    CategoryApi.createCategory(categoryName).then((res) => {
      refetch();
      setCategoryOpen(false);
    });
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
              <Dialog
                open={categoryOpen}
                onOpenChange={(value) => setCategoryOpen(value)}
              >
                <DialogContent>
                  <DialogHeader>Yeni kateqoriya</DialogHeader>
                  <DialogBody>
                    <div>
                      <Label>Adı</Label>
                      <Input
                        placeholder={"Kateqoriya adını daxil edin"}
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                      />
                    </div>
                    <Button
                      onClick={saveCategory}
                      className={"mt-3 float-right"}
                    >
                      Yadda saxla
                    </Button>
                  </DialogBody>
                </DialogContent>
              </Dialog>

              <div>
                <Label>Kateqoriya</Label>
                <Select
                  onValueChange={(value) =>
                    setData((prevState) => ({
                      ...prevState,
                      categoryId: value,
                    }))
                  }
                  value={data.categoryId || undefined}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Kateqoriya" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.data.map((category: any) => {
                      return (
                        <SelectItem value={category.id} key={category.id}>
                          {category.name}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <button
                  onClick={() => setCategoryOpen(true)}
                  className={
                    "w-full text-left  transition-all ease-in-out px-2   mt-1 text-primary"
                  }
                >
                  {" "}
                  Yeni kateqoriya yarat
                </button>
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
