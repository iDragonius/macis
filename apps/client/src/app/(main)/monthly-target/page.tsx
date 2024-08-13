"use client";
import { PageTitle } from "@/components/ui/page-title";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MonthlyTarget } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { DataTable } from "@/components/ui/data-table";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { MonthlyTargetApi } from "@/lib/api/monthly-target.api";
import toast from "react-hot-toast";
import { formatMonth } from "@/lib/utils";
import { MeetingScheduleApi } from "@/lib/api/meeting-schedule.api";
import useConfirmationDialog from "@/hooks/use-confirmation-dialog";

export default function MonthlyTargets() {
  const { data, refetch } = useQuery({
    queryKey: ["monthly-targets"],
    queryFn: MonthlyTargetApi.getAllMonthlyTargets,
  });
  const { push } = useRouter();
  const { setDialogState } = useConfirmationDialog();

  const columns: ColumnDef<MonthlyTarget>[] = [
    {
      accessorKey: "data.manager.profile.firstName",
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
      accessorKey: "data.year",
      header: "İl",
      cell: ({ row }) => {
        const year = row?.original?.data?.year;
        return <div className={""}>{year}</div>;
      },
    },
    {
      accessorKey: "data.month",
      header: "Ay",
      cell: ({ row }) => {
        const month = formatMonth(row?.original?.data?.month);

        return <div className={""}>{month}</div>;
      },
    },
    {
      accessorKey: "data.meetingTarget",
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
      accessorKey: "followingMeetingsCount",
      header: "Təqib olunan görüş sayı",
      cell: ({ row }) => {
        const followingMeetingsCount = row?.original?.followingMeetingsCount;
        return <div>{followingMeetingsCount}</div>;
      },
    },
    {
      accessorKey: "refusedMeetingsCount",
      header: "Rədd görüş sayı",
      cell: ({ row }) => {
        const refusedMeetingsCount = row?.original?.refusedMeetingsCount;
        return <div>{refusedMeetingsCount}</div>;
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
                  href={`/manager/${data.data.managerId}`}
                  className={"w-full"}
                >
                  Menecerə bax
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  href={`/monthly-target/edit/${data.data.id}`}
                  className={"w-full"}
                >
                  Dəyiş
                </Link>
              </DropdownMenuItem>{" "}
              <DropdownMenuItem
                onClick={() => {
                  setDialogState({
                    isOpen: true,
                    confirmFunction() {
                      MonthlyTargetApi.deleteMonthlyTarget(data.data.id).then(
                        () => {
                          toast.success("Aylıq hədəf uğurla silindi!");
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
