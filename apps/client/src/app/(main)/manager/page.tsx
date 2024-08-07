"use client";
import { PageTitle } from "@/components/ui/page-title";
import { useQuery } from "@tanstack/react-query";
import { UserApi } from "@/lib/api/user.api";
import { ColumnDef } from "@tanstack/react-table";
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
import { useRouter } from "next/navigation";
import { getRole } from "@/lib/utils";
import toast from "react-hot-toast";
import useConfirmationDialog from "@/hooks/use-confirmation-dialog";
import Link from "next/link";

export type User = {
  id: string;
  email: string;
  profile: {
    firstName: string;
    gender: string;
    lastName: string;
    fatherName: string;
    phoneNumber: string;
  };
};

export default function Managers() {
  const { data, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: UserApi.getAllManagers,
  });
  const { setDialogState } = useConfirmationDialog();

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <div>{row.getValue("email")}</div>,
    },
    {
      accessorKey: "profile.firstName",
      header: "Ad",
      cell: ({ row }) => {
        const fullName =
          row?.original?.profile?.firstName +
          " " +
          row?.original?.profile?.lastName;

        return <div>{fullName}</div>;
      },
    },
    {
      accessorKey: "role",
      header: "Rol",
      cell: ({ row }) => {
        return <div>{getRole(row.getValue("role"))}</div>;
      },
    },
    {
      accessorKey: "profile.phoneNumber",
      header: "Telefon nömrəsi",
      cell: ({ row }) => {
        const phoneNumber = row?.original?.profile?.phoneNumber;

        return <div>{phoneNumber}</div>;
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
                <Link href={`/manager/${row.original.id}`}>Menecerə bax</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  const { push } = useRouter();
  return (
    <>
      <div className={"flex justify-between items-center"}>
        <PageTitle>Menecerlər</PageTitle>
      </div>
      <DataTable data={data?.data} columns={columns} />
    </>
  );
}
