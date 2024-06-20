"use client";
import { PageTitle } from "@/components/ui/page-title";
import { useQuery } from "@tanstack/react-query";
import { UserApi } from "@/lib/api/user.api";
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
import { DataTable } from "@/components/ui/data-table";
import { useRouter } from "next/navigation";

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

const columns: ColumnDef<User>[] = [
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
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <div>{row.getValue("email")}</div>,
  },
  {
    accessorKey: "fullName",
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
    accessorKey: "phoneNumber",
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
              <Link href={`/customers/${data.id}`}>Müştəriyə bax</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Sil</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
export default function Users() {
  const { data } = useQuery({
    queryKey: ["users"],
    queryFn: UserApi.getAllUsers,
  });
  const { push } = useRouter();
  return (
    <>
      <div className={"flex justify-between items-center"}>
        <PageTitle>İstifadəçilər</PageTitle>
        <Button onClick={() => push("/users/add")}>Yeni istifadəçi</Button>
      </div>
      <DataTable data={data?.data} columns={columns} />
    </>
  );
}