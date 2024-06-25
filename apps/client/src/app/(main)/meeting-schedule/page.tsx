"use client";
import { ColumnDef } from "@tanstack/react-table";
import { MeetingProps } from "@/lib/types";
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
import { useState } from "react";
import { CallResultType, CallScheduleApi } from "@/lib/api/call-schedule.api";
import { useQuery } from "@tanstack/react-query";
import { PageTitle } from "@/components/ui/page-title";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/ui/data-table";
import {
  MeetingResultType,
  MeetingScheduleApi,
} from "@/lib/api/meeting-schedule.api";
import { useRouter } from "next/navigation";
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
          href={`/customers/${row.original.customer.id}`}
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

            {/*<DropdownMenuItem>Sil</DropdownMenuItem>*/}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function MeetingSchedule() {
  const [result, setResult] = useState<MeetingResultType | null>(null);
  const { data } = useQuery({
    queryKey: ["calls", result],
    queryFn: () => MeetingScheduleApi.getAllMeetings(result),
  });

  const { push } = useRouter();
  return (
    <div>
      <div className={"flex items-center justify-between"}>
        <PageTitle>Görüş qrafiki</PageTitle>
        <div className={"flex items-center gap-4"}>
          {/*<Select*/}
          {/*  onValueChange={(value) => {*/}
          {/*    if (value === "ALL") {*/}
          {/*      setResult(null);*/}
          {/*    } else {*/}
          {/*      setResult(value as MeetingResultType);*/}
          {/*    }*/}
          {/*  }}*/}
          {/*  value={result || "ALL"}*/}
          {/*>*/}
          {/*  <SelectTrigger className={"w-[200px]"}>*/}
          {/*    <SelectValue placeholder="" />*/}
          {/*  </SelectTrigger>*/}
          {/*  <SelectContent>*/}
          {/*    <SelectItem value="ALL">Hamısı</SelectItem>*/}
          {/*    <SelectItem value="CONTRACT_SIGNED">Müqavilə bağlandı</SelectItem>*/}
          {/*    <SelectItem value="WILL_BE_FOLLOWED">Təqib olunacaq</SelectItem>*/}
          {/*    <SelectItem value="REFUSED">İtirilmiş</SelectItem>*/}
          {/*  </SelectContent>*/}
          {/*</Select>*/}

          <Button
            onClick={() => {
              push("/meeting-schedule/add");
            }}
          >
            Yeni görüş
          </Button>
        </div>
      </div>
      <DataTable data={data?.data} columns={meetingColumns} />
    </div>
  );
}
