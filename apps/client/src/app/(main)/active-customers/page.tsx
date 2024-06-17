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

export type ActiveCustomer = {
  id: string;
  company: string;
  head: string;
  contactNumber: string;
  contractDate: string;
  service: string;
  payment: string;
  ownersBirthday: string;
  companyEstablishmentDate: string;
  curator: string;
};

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
          href={`/company/${row.original.id}`}
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
    accessorKey: "payment",
    header: "Ödəniş",
    cell: ({ row }) => <div>{row.getValue("payment")}</div>,
  },
  {
    accessorKey: "ownersBirthday",
    header: "Sahibkarın doğum günü",
    cell: ({ row }) => <div>{formatDate(row.getValue("ownersBirthday"))}</div>,
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
    cell: ({ row }) => <div>{row.getValue("curator")}</div>,
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
              <Link href={`/customers/${data.id}`}>Müştəriyə bax</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Sil</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function ActiveCustomers() {
  const { data, isLoading } = useQuery({
    queryKey: ["active-customers"],
    queryFn: CustomerApi.getActiveCustomers,
  });

  return (
    <div className={""}>
      <h1 className={"text-[32px] font-semibold"}>Aktiv müştərilər</h1>
      <DataTable data={data?.data} columns={columns} />
    </div>
  );
}
