"use client";
import { PageTitle } from "@/components/ui/page-title";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { CustomerApi } from "@/lib/api/customer.api";
import { LostCustomer } from "@/app/(main)/lost-customers/page";
import { DataTable } from "@/components/ui/data-table";
import { useRouter } from "next/navigation";
const columns: ColumnDef<LostCustomer>[] = [
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
    accessorKey: "manager",
    header: "Menecer",
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
    accessorKey: "meetingTarget",
    header: "Görüş hədəfi",
    cell: ({ row }) => <div>{row.getValue("head")}</div>,
  },
  {
    accessorKey: "contractNumber",
    header: "Müqavilə sayı",
    cell: ({ row }) => <div>{row.getValue("contactNumber")}</div>,
  },
  {
    accessorKey: "total",
    header: "Toplam məbləğ",
    cell: ({ row }) => <div>{row.getValue("contractDate")}</div>,
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
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function MonthlyTarget() {
  const { push } = useRouter();
  return (
    <div>
      <div className={"flex justify-between items-center"}>
        <PageTitle>Aylıq hədəf qrafiki</PageTitle>
        <Button onClick={() => push("/monthly-target/add")}>
          Yeni aylıq hədəf
        </Button>
      </div>
      <DataTable data={[]} columns={columns} />
    </div>
  );
}
