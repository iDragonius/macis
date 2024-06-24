"use client";
import { ColumnDef } from "@tanstack/react-table";
import { CallProps, CallResult, MeetingResult } from "@/lib/types";
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
import { CallResultType, CallScheduleApi } from "@/lib/api/call-schedule.api";
import { PageTitle } from "@/components/ui/page-title";
import { DataTable } from "@/components/ui/data-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MeetingResultType,
  MeetingScheduleApi,
} from "@/lib/api/meeting-schedule.api";

export default function DailyCallSchedule() {
  const { data, refetch } = useQuery({
    queryKey: ["daily-calls"],
    queryFn: CallScheduleApi.getDailyCallSchedule,
  });

  const callColumns: ColumnDef<CallProps>[] = [
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
      accessorKey: "contactDate",
      header: "Əlaqə tarixi",
      cell: ({ row }) => {
        return <div>{formatDate(row.getValue("contactDate"))}</div>;
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
              CallScheduleApi.changeCallResult(
                value as CallResultType,
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
              <SelectItem value={CallResult.UNKNOWN}>Məlumat yoxdur</SelectItem>{" "}
              <SelectItem value={CallResult.WILL_BE_MEETING}>
                Görüş olacaq
              </SelectItem>{" "}
              <SelectItem value={CallResult.WILL_BE_FOLLOWED}>
                Təqib olunacaq
              </SelectItem>{" "}
              <SelectItem value={CallResult.REFUSED}>İstəmir</SelectItem>
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
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
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

  return (
    <div>
      <div>
        <PageTitle>Günlük zəng qrafiki</PageTitle>
      </div>
      <DataTable data={data?.data} columns={callColumns} />
    </div>
  );
}
