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
import { cn } from "@/lib/utils";

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
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div>
      <PageTitle>Yeni zəng</PageTitle>
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
