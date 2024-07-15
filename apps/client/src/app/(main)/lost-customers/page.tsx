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
import { DataTable } from "@/components/ui/data-table";
import { useQuery } from "@tanstack/react-query";
import { CustomerApi } from "@/lib/api/customer.api";
import Link from "next/link";
import { PageTitle } from "@/components/ui/page-title";
import { formatDate } from "@/lib/utils";
import { MeetingScheduleApi } from "@/lib/api/meeting-schedule.api";
import toast from "react-hot-toast";
import useConfirmationDialog from "@/hooks/use-confirmation-dialog";

export type LostCustomer = {
  id: string;
  company: string;
  head: string;
  contactNumber: string;
  contractDate: string;
  service: string;
  termsOfPayment: string;
  terminationReason: string;
  curator: string;
  contractExpirationDate: string;
};

export default function LostCustomers() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["lost-customers"],
    queryFn: CustomerApi.getLostCustomers,
  });
  const { setDialogState } = useConfirmationDialog();

  const columns: ColumnDef<LostCustomer>[] = [
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
      accessorKey: "contractExpirationDate",
      header: "Müqavilənin bitmə tarixi",
      cell: ({ row }) => (
        <div>{formatDate(row.getValue("contractExpirationDate"))}</div>
      ),
    },
    {
      accessorKey: "service",
      header: "Aldığı xidmət",
      cell: ({ row }) => <div>{row.getValue("service")}</div>,
    },
    {
      accessorKey: "curator",
      header: "Kurator",
      cell: ({ row }) => <div>{row.getValue("curator")}</div>,
    },
    {
      accessorKey: "termsOfPayment",
      header: "Ödəniş şərtləri",
      cell: ({ row }) => <div>{row.getValue("termsOfPayment")}</div>,
    },
    {
      accessorKey: "terminationReason",
      header: "Xitam səbəbi",
      cell: ({ row }) => <div>{row.getValue("terminationReason")}</div>,
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
                          refetch();
                          toast.success("Müştəri uğurla silindi!");
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
      <PageTitle>İtirilmiş müştərilər</PageTitle>

      <DataTable data={data?.data} columns={columns} />
    </div>
  );
}
