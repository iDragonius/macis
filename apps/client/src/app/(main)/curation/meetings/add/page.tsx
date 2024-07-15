"use client";
import { useQuery } from "@tanstack/react-query";
import { CustomerApi } from "@/lib/api/customer.api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CurationCallApi } from "@/lib/api/curation-call.api";
import toast from "react-hot-toast";
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
import { CurationMeetingApi } from "@/lib/api/curation-meeting.api";
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

export default function Page() {
  const { data: customers } = useQuery({
    queryKey: ["customers"],
    queryFn: CustomerApi.getAllCustomers,
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

  function save() {
    CurationMeetingApi.createCurationMeeting(data).then((res) => {
      toast.success("Kurasiya  görüşü uğurla yaradıldı");
      push("/curation/meetings");
    });
  }
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div>
      <PageTitle>Yeni kurasiya görüşü</PageTitle>
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
