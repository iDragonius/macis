"use client";
import { ColumnDef } from "@tanstack/react-table";
import { CallProps, MeetingProps, MeetingResult } from "@/lib/types";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { formatDate, formatField } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { CallScheduleApi } from "@/lib/api/call-schedule.api";
import { PageTitle } from "@/components/ui/page-title";
import { DataTable } from "@/components/ui/data-table";
import MeetingSchedule from "@/app/(main)/meeting-schedule/page";
import {
  MeetingResultType,
  MeetingScheduleApi,
} from "@/lib/api/meeting-schedule.api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CustomerApi } from "@/lib/api/customer.api";

export default function DailyMeetingSchedule() {
  const { data, refetch } = useQuery({
    queryKey: ["daily-calls"],
    queryFn: MeetingScheduleApi.getDailyMeetingSchedule,
  });

  const meetingColumns: ColumnDef<MeetingProps>[] = [
    {
      accessorKey: "customer.company",
      header: "Şirkət",
      cell: ({ row }) => {
        const company = row.original.customer.company;
        return (
          <Link
            href={`/customers/${row.original.customer.id}`}
            className={"text-blue-700 font-medium"}
          >
            {formatField(company)}
          </Link>
        );
      },
    },
    {
      accessorKey: "customer.head",
      header: "Rəhbər",
      cell: ({ row }) => {
        const head = row.original.customer.head;
        return <div>{formatField(head)}</div>;
      },
    },
    {
      accessorKey: "customer.position",
      header: "Vəzifəsi",
      cell: ({ row }) => {
        const head = row.original.customer.position;
        return <div>{formatField(head)}</div>;
      },
    },
    {
      accessorKey: "customer.contactNumber",
      header: "Əlaqə nömrəsi",
      cell: ({ row }) => {
        const contactNumber = row.original.customer.contactNumber;
        return <div>{formatField(contactNumber)}</div>;
      },
    },
    {
      accessorKey: "meetingDate",
      header: "Görüş tarixi",
      cell: ({ row }) => {
        return <div>{formatDate(row.getValue("meetingDate"))}</div>;
      },
    },
    {
      accessorKey: "meetingTime",
      header: "Görüş saatı",
      cell: ({ row }) => {
        return <div>{formatField(row.getValue("meetingTime"))}</div>;
      },
    },

    {
      accessorKey: "result",
      header: "Nəticə",
      cell: ({ row }) => {
        return (
          <Select
            value={row.original.result}
            onValueChange={(value) => {
              MeetingScheduleApi.changeMeetingResult(
                value as MeetingResultType,
                row.original.id,
              ).then((res) => {
                refetch();
              });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Nəticə" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={MeetingResult.UNKNOWN}>
                Məlumat yoxdur
              </SelectItem>{" "}
              <SelectItem value={MeetingResult.CONTRACT_SIGNED}>
                Müqavilə bağlanıb
              </SelectItem>{" "}
              <SelectItem value={MeetingResult.WILL_BE_FOLLOWED}>
                Təqib olunacaq
              </SelectItem>{" "}
              <SelectItem value={MeetingResult.REFUSED}>İstəmir</SelectItem>
            </SelectContent>
          </Select>
        );
      },
    },
    {
      accessorKey: "notes",
      header: "Əlavə qeydlər",
      cell: ({ row }) => {
        return <div>{formatField(row.getValue("notes"))}</div>;
      },
    },
    // {
    //   id: "actions",
    //   enableHiding: false,
    //   cell: ({ row }) => {
    //     const data = row.original;
    //
    //     return (
    //       <DropdownMenu>
    //         <DropdownMenuTrigger asChild>
    //           <Button variant="ghost" className="h-8 w-8 p-0">
    //             <span className="sr-only">Open menu</span>
    //             <DotsHorizontalIcon className="h-4 w-4" />
    //           </Button>
    //         </DropdownMenuTrigger>
    //         <DropdownMenuContent align="end">
    //           <DropdownMenuLabel>Əməliyyatlar</DropdownMenuLabel>
    //
    //           {/*<DropdownMenuItem*/}
    //           {/*  onClick={() => {*/}
    //           {/*    CallScheduleApi.deleteCall(row.original.id).then((res) => {*/}
    //           {/*      refetch();*/}
    //           {/*    });*/}
    //           {/*  }}*/}
    //           {/*>*/}
    //           {/*  Sil*/}
    //           {/*</DropdownMenuItem>*/}
    //         </DropdownMenuContent>
    //       </DropdownMenu>
    //     );
    //   },
    // },
  ];
  return (
    <div>
      <div>
        <PageTitle>Günlük görüş qrafiki</PageTitle>
      </div>
      <DataTable data={data?.data} columns={meetingColumns} />
    </div>
  );
}
