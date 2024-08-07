"use client";
import { ColumnDef } from "@tanstack/react-table";
import { getRole } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { PageTitle } from "@/components/ui/page-title";
import { DataTable } from "@/components/ui/data-table";
import { User } from "@/app/(main)/users/page";
export default function Page() {
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: "Adı",
      cell: ({ row }) => <div>{row.getValue("email")}</div>,
    },
    {
      accessorKey: "presentationLink",
      header: "Təqdimat linki",
      cell: ({ row }) => {
        const fullName =
          row?.original?.profile?.firstName +
          " " +
          row?.original?.profile?.lastName;

        return <div>{fullName}</div>;
      },
    },
    {
      accessorKey: "videoLink",
      header: "Video linki",
      cell: ({ row }) => {
        return <div>{getRole(row.getValue("role"))}</div>;
      },
    },
  ];
  const { push } = useRouter();
  return (
    <>
      <div className={"flex justify-between items-center"}>
        <PageTitle>Satış təlimləri</PageTitle>
      </div>
      <DataTable data={[]} columns={columns} />
    </>
  );
}
