"use client";
import { ChevronDownIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CustomerApi } from "@/lib/api/customer.api";
import dayjs from "dayjs";
import { formatDate } from "@/lib/utils";
import { DataTable } from "@/components/ui/data-table";
import Link from "next/link";
import { PageTitle } from "@/components/ui/page-title";

export type ActiveCustomer = {
  id: string;
  company: string;
  head: string;
  contactNumber: string;
  contractDate: string;
  service: string;
  paymentAmount: number;
  ownersBirthday: string;
  companyEstablishmentDate: string;
  manager: {
    profile: {
      firstName: string;
      lastName: string;
    };
  };
  curator: string;
};

export default function ActiveCustomers() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["active-customers"],
    queryFn: CustomerApi.getActiveCustomers,
  });
  const columns: ColumnDef<ActiveCustomer>[] = [
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
        return (
          <Link
            href={`/customers/${row.original.id}`}
            className={"text-blue-700 font-medium"}
          >
            {row.getValue("company")}
          </Link>
        );
      },
    },
    {
      accessorKey: "head",
      header: "Rəhbər",
      cell: ({ row }) => <div>{row.getValue("head")}</div>,
    },
    {
      accessorKey: "contactNumber",
      header: "Əlaqə nömrəsi",
      cell: ({ row }) => <div>{row.getValue("contactNumber")}</div>,
    },
    {
      accessorKey: "contractDate",
      header: "Müqavilə tarixi",
      cell: ({ row }) => <div>{formatDate(row.getValue("contractDate"))}</div>,
    },
    {
      accessorKey: "service",
      header: "Aldığı xidmət",
      cell: ({ row }) => <div>{row.getValue("service")}</div>,
    },
    {
      accessorKey: "paymentAmount",
      header: "Ödəniş",
      cell: ({ row }) => <div>{row.getValue("paymentAmount")}</div>,
    },
    {
      accessorKey: "ownersBirthday",
      header: "Sahibkarın doğum günü",
      cell: ({ row }) => (
        <div>{formatDate(row.getValue("ownersBirthday"))}</div>
      ),
    },
    {
      accessorKey: "companyEstablishmentDate",
      header: "Şirkətin yaranma tarixi",
      cell: ({ row }) => (
        <div>{formatDate(row.getValue("companyEstablishmentDate"))}</div>
      ),
    },
    {
      accessorKey: "curator",
      header: "Kurator",
      cell: ({ row }) => <div>{row.original?.curator}</div>,
    },
    {
      accessorKey: "manager",
      header: "Menecer",
      cell: ({ row }) => (
        <div>
          {(row.original?.manager?.profile?.firstName || "") +
            " " +
            (row?.original?.manager?.profile?.lastName || "")}
        </div>
      ),
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
              <DropdownMenuItem>
                <Link href={`/customers/${data.id}`} className={"w-full"}>
                  Müştəriyə bax
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href={`/customers/edit/${data.id}`} className={"w-full"}>
                  Dəyiş
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  CustomerApi.deleteCustomer(row.original.id).then((res) => {
                    refetch();
                  });
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
    <div className={""}>
      <PageTitle>Aktiv müştərilər</PageTitle>

      <DataTable data={data?.data} columns={columns} />
    </div>
  );
}
