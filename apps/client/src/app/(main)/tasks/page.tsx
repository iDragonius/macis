"use client";
import { ColumnDef } from "@tanstack/react-table";
import { CallProps, CallResult } from "@/lib/types";
import Link from "next/link";
import { formatDate, formatField } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CallResultType, CallScheduleApi } from "@/lib/api/call-schedule.api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import toast from "react-hot-toast";
import { PageTitle } from "@/components/ui/page-title";
import { DataTable } from "@/components/ui/data-table";

export default function Page() {
  const columns: ColumnDef<CallProps>[] = [
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
      accessorKey: "type",
      header: "Tapşırıq tipi",
      cell: ({ row }) => {
        return <div>{formatDate(row.getValue("contactDate"))}</div>;
      },
    },

    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        return (
          <Select
            value={row.original.result}
            onValueChange={(value) => {
              CallScheduleApi.changeCallResult(
                value as CallResultType,
                row.original.id,
              ).then((res) => {
                // refetch();
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

              <DropdownMenuItem
                onClick={() => {
                  // setDialogState({
                  //   isOpen: true,
                  //   confirmFunction() {
                  //     CallScheduleApi.deleteCall(data.id).then(() => {
                  //       refetch();
                  //       toast.success("Zəng uğurla silindi!");
                  //     });
                  //   },
                  // });
                }}
              >
                Sil
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div>
      <PageTitle>Günlük tapşırıqlar</PageTitle>

      <DataTable data={[]} columns={columns} />
    </div>
  );
}
