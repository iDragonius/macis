"use client";
import { ColumnDef } from "@tanstack/react-table";
import { CallProps, MeetingProps } from "@/lib/types";
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
import { MeetingScheduleApi } from "@/lib/api/meeting-schedule.api";

const meetingColumns: ColumnDef<MeetingProps>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "company",
    header: "Şirkət",
    cell: ({ row }) => {
      const company = row.original.customer.company;
      return (
        <Link
          href={`/company/${row.original.customer.id}`}
          className={"text-blue-700 font-medium"}
        >
          {formatField(company)}
        </Link>
      );
    },
  },
  {
    accessorKey: "head",
    header: "Rəhbər",
    cell: ({ row }) => {
      const head = row.original.customer.head;
      return <div>{formatField(head)}</div>;
    },
  },
  {
    accessorKey: "position",
    header: "Vəzifəsi",
    cell: ({ row }) => {
      const head = row.original.customer.position;
      return <div>{formatField(head)}</div>;
    },
  },
  {
    accessorKey: "contactNumber",
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
      let result = row.original.result;

      if (result === "REFUSED") {
        return <div className={"text-red-600 font-semibold"}>İstəmir</div>;
      } else if (result === "WILL_BE_FOLLOWED") {
        return (
          <div className={"text-green-600 font-semibold"}>Təqib olunacaq</div>
        );
      } else if (result === "CONTRACT_SIGNED") {
        return (
          <div className={"text-blue-600 font-semibold"}>Müqavilə bağlandı</div>
        );
      } else {
        return <div className={"font-semibold"}>Bilinmir</div>;
      }
    },
  },
  {
    accessorKey: "notes",
    header: "Əlavə qeydlər",
    cell: ({ row }) => {
      return <div>{formatField(row.getValue("notes"))}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const data = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Əməliyyatlar</DropdownMenuLabel>

            <DropdownMenuItem>Sil</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function DailyMeetingSchedule() {
  const { data } = useQuery({
    queryKey: ["daily-calls"],
    queryFn: MeetingScheduleApi.getDailyMeetingSchedule,
  });
  return (
    <div>
      <div>
        <PageTitle>Günlük görüş qrafiki</PageTitle>
      </div>
      <DataTable data={data?.data} columns={meetingColumns} />
    </div>
  );
}
