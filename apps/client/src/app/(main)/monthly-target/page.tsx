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
import { useQuery } from "@tanstack/react-query";
import { MonthlyTargetApi } from "@/lib/api/monthly-target.api";
import toast from "react-hot-toast";
import { formatMonth } from "@/lib/utils";

type MonthlyTarget = {
  data: {
    id: string;
    meetingTarget: number;
    manager: {
      profile: {
        firstName: string;
        lastName: string;
      };
    };
    managerId: string;
    year: number;
    month: string;
  };
  meetingCount: number;
  signedContractCount: number;
  totalAmount: number;
};

export default function MonthlyTarget() {
  const { data, refetch } = useQuery({
    queryKey: ["monthly-targets"],
    queryFn: MonthlyTargetApi.getAllMonthlyTargets,
  });
  const { push } = useRouter();

  const columns: ColumnDef<MonthlyTarget>[] = [
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
        const manager =
          row.original.data.manager.profile.firstName +
          " " +
          row.original.data.manager.profile.lastName;
        return <div className={""}>{manager}</div>;
      },
    },
    {
      accessorKey: "year",
      header: "İl",
      cell: ({ row }) => {
        const year = row?.original?.data?.year;
        return <div className={""}>{year}</div>;
      },
    },
    {
      accessorKey: "month",
      header: "Ay",
      cell: ({ row }) => {
        const month = formatMonth(row?.original?.data?.month);

        return <div className={""}>{month}</div>;
      },
    },
    {
      accessorKey: "meetingTarget",
      header: "Görüş hədəfi",
      cell: ({ row }) => {
        const meetingTarget = row?.original?.data?.meetingTarget;
        return <div>{meetingTarget}</div>;
      },
    },
    {
      accessorKey: "meetingCount",
      header: "Görüş sayı",
      cell: ({ row }) => {
        const meetingCount = row?.original?.meetingCount;
        return <div>{meetingCount}</div>;
      },
    },
    {
      accessorKey: "signedContractCount",
      header: "Müqavilə sayı",
      cell: ({ row }) => <div>{row.getValue("signedContractCount") || 0}</div>,
    },
    {
      accessorKey: "totalAmount",
      header: "Toplam məbləğ",
      cell: ({ row }) => <div>{row.getValue("totalAmount") || 0}</div>,
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
                <Link
                  href={`/monthly-target/edit/${data.data.id}`}
                  className={"w-full"}
                >
                  Dəyiş
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  MonthlyTargetApi.deleteMonthlyTarget(data.data.id).then(
                    (res) => {
                      toast.success("Aylıq hədəf uğurla silindi!");
                      refetch();
                    },
                  );
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
      <div className={"flex justify-between items-center"}>
        <PageTitle>Aylıq hədəf qrafiki</PageTitle>
        <Button onClick={() => push("/monthly-target/add")}>
          Yeni aylıq hədəf
        </Button>
      </div>
      <DataTable data={data?.data} columns={columns} />
    </div>
  );
}
