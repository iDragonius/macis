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
import { cn, formatInputDate } from "@/lib/utils";
import { CategoryApi } from "@/lib/api/category.api";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogBody } from "next/dist/client/components/react-dev-overlay/internal/components/Dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CaretSortIcon } from "@radix-ui/react-icons";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { CheckIcon } from "lucide-react";
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
  categoryId: string | null;
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

  const { data: categories, refetch } = useQuery({
    queryKey: ["categories"],
    queryFn: CategoryApi.getAllCategories,
  });
  const [categoryOpen, setCategoryOpen] = useState<boolean>(false);
  const [categoryName, setCategoryName] = useState<string>("");
  const [data, setData] = useState<MeetingDto>({
    customerId: null,
    categoryId: null,
    contactDate: "",
    notes: "",
    result: "UNKNOWN",
    reasonForRejection: "",
    nextContactDate: "",
    nextMeetingDate: "",
    meetingDate: "",
    meetingTime: "",
  });
  function saveCategory() {
    CategoryApi.createCategory(categoryName).then((res) => {
      refetch();
      setCategoryOpen(false);
    });
  }
  useEffect(() => {
    if (meeting) {
      setData({
        customerId: meeting?.data?.customer?.id,
        contactDate: formatInputDate(meeting?.data?.contactDate),
        notes: meeting?.data?.notes,
        result: meeting?.data?.result,
        reasonForRejection: meeting?.data?.reasonForRejection,
        nextContactDate: formatInputDate(meeting?.data?.nextContactDate),
        nextMeetingDate: formatInputDate(meeting?.data?.nextMeetingDate),
        meetingTime: meeting?.data?.meetingTime,
        meetingDate: formatInputDate(meeting?.data?.meetingDate),
        categoryId: meeting?.data?.categoryId,
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
          meetingDate: data.meetingDate,
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
          categoryId: data.categoryId,
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
          meetingDate: data.meetingDate,
          nextMeetingDate: data.nextMeetingDate,
        },
        params.id,
      ).then((res) => {
        push("/meeting-schedule/will-be-followed");
      });
    }
  }
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div>
      <PageTitle>Görüş məlumatlarını dəyiş</PageTitle>

      <div className={"mt-5 grid grid-cols-2 gap-8"}>
        <div className={"flex flex-col w-full mt-1.5"}>
          <Label className={"mb-1"}>Müştərini seçin</Label>

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="w-full justify-between"
              >
                {data.customerId
                  ? customers?.data?.find(
                      (customer: any) => customer.id === data.customerId,
                    )?.company
                  : "Müştərini seçin..."}
                <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
              <Command>
                <CommandInput
                  placeholder="Müştərini axtar..."
                  className="h-9"
                />
                <CommandEmpty>Heç bir müştəri tapılmadı.</CommandEmpty>
                <CommandGroup>
                  <CommandList>
                    {customers?.data?.map((customer: any) => (
                      <CommandItem
                        key={customer.id}
                        value={customer.company}
                        onSelect={(currentValue) => {
                          setData((prevState) => ({
                            ...prevState,
                            customerId: customer.id,
                          }));
                          setOpen(false);
                        }}
                      >
                        {customer.company}
                        <CheckIcon
                          className={cn(
                            "ml-auto h-4 w-4",
                            data.customerId === customer.id
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandList>
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
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
            placeholder={"Görüş tarixi"}
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
