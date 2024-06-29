"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { DataTable } from "@/components/ui/data-table";
import { useQuery } from "@tanstack/react-query";
import { CustomerApi } from "@/lib/api/customer.api";
import { getCustomerStatus } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageTitle } from "@/components/ui/page-title";

export type Customer = {
  id: string;
  company: string;
  head: string;
  contactNumber: string;
  status: string;
  position: string | null;
};

export default function Customers() {
  const { data, refetch } = useQuery({
    queryKey: ["customers"],
    queryFn: CustomerApi.getAllCustomers,
  });
  const { push } = useRouter();

  const columns: ColumnDef<Customer>[] = [
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
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = getCustomerStatus(row.getValue("status"));
        return <div>{status}</div>;
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
              <DropdownMenuItem>
                <Link href={`/customers/${data.id}`}>Müştəriyə bax</Link>
              </DropdownMenuItem>{" "}
              <DropdownMenuItem>
                <Link href={`/customers/edit/${data.id}`}>Dəyiş</Link>
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
      <div className={"flex items-center justify-between"}>
        <PageTitle>Müştərilər</PageTitle>
        <Button onClick={() => push("/customers/add")}>Yeni müştəri</Button>
      </div>
      <DataTable data={data?.data} columns={columns} />
    </div>
  );
}
