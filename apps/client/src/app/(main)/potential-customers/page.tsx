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
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { CustomerApi } from "@/lib/api/customer.api";
import { DataTable } from "@/components/ui/data-table";
import { PageTitle } from "@/components/ui/page-title";
import { MonthlyTargetApi } from "@/lib/api/monthly-target.api";
import toast from "react-hot-toast";
import useConfirmationDialog from "@/hooks/use-confirmation-dialog";

export type PotentialCustomer = {
  id: string;
  company: string;
  head: string;
  contactNumber: string;
  position: string;
  source: string;
  notes: string;
  service: string;
};

export default function PotentialCustomers() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["potential-customers"],
    queryFn: CustomerApi.getPotentialCustomers,
  });
  const { setDialogState } = useConfirmationDialog();

  const columns: ColumnDef<PotentialCustomer>[] = [
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
      accessorKey: "position",
      header: "Vəzifəsi",
      cell: ({ row }) => <div>{row.getValue("position")}</div>,
    },
    {
      accessorKey: "source",
      header: "Mənbə",
      cell: ({ row }) => <div>{row.getValue("source")}</div>,
    },
    {
      accessorKey: "notes",
      header: "Qeydlər",
      cell: ({ row }) => <div>{row.getValue("notes")}</div>,
    },
    {
      accessorKey: "service",
      header: "Aldığı xidmət",
      cell: ({ row }) => <div>{row.getValue("service")}</div>,
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
                  setDialogState({
                    isOpen: true,
                    confirmFunction() {
                      CustomerApi.deleteCustomer(row.original.id).then(
                        (res) => {
                          toast.success("Müştəri uğurla silindi!");
                          refetch();
                        },
                      );
                    },
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
      <PageTitle>Potensial müştərilər</PageTitle>

      <DataTable data={data?.data} columns={columns} />
    </div>
  );
}
