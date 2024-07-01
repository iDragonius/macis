"use client";
import { PageTitle } from "@/components/ui/page-title";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { CurationCallApi } from "@/lib/api/curation-call.api";
import { ColumnDef } from "@tanstack/react-table";
import { CurationMeetingProps } from "@/lib/types";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { formatDate, formatField } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { DataTable } from "@/components/ui/data-table";
import { CurationMeetingApi } from "@/lib/api/curation-meeting.api";

export default function Page() {
  const { push } = useRouter();

  const { data, refetch } = useQuery({
    queryKey: ["curation-meetings"],
    queryFn: CurationMeetingApi.getCurationMeetings,
  });
  console.log(data);
  const columns: ColumnDef<CurationMeetingProps>[] = [
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
        const company = row?.original?.customer?.company;
        return (
          <Link
            href={`/customers/${row?.original?.customer?.id}`}
            className={"text-blue-700 font-medium"}
          >
            {formatField(company)}
          </Link>
        );
      },
    },
    {
      accessorKey: "head",
      header: "Rəhbər",
      cell: ({ row }) => {
        const head = row?.original?.customer?.head;
        return <div>{formatField(head)}</div>;
      },
    },

    {
      accessorKey: "contactNumber",
      header: "Əlaqə nömrəsi",
      cell: ({ row }) => {
        const contactNumber = row?.original?.customer?.contactNumber;
        return <div>{formatField(contactNumber)}</div>;
      },
    },
    {
      accessorKey: "meetingDate",
      header: "Görüş tarixi",
      cell: ({ row }) => {
        return <div>{formatDate(row.getValue("meetingDate"))}</div>;
      },
    },
    {
      accessorKey: "meetingTime",
      header: "Görüş zamanı",
      cell: ({ row }) => {
        return <div>{formatField(row.getValue("meetingTime"))}</div>;
      },
    },
    {
      accessorKey: "customerFeedback",
      header: "Müştəri geridönüşləri ",
      cell: ({ row }) => {
        return <div>{formatField(row.getValue("customerFeedback"))}</div>;
      },
    },
    {
      accessorKey: "customerRequests",
      header: "Müştəri istəkləri",
      cell: ({ row }) => {
        return <div>{formatField(row.getValue("customerRequests"))}</div>;
      },
    },
    {
      accessorKey: "nuances",
      header: "Narazı olduğu bir nüans varmı",
      cell: ({ row }) => {
        return <div>{formatField(row.getValue("nuances"))}</div>;
      },
    },
    {
      accessorKey: "referenceCompanies",
      header: "Bizi referans etdiyi şirkətlər",
      cell: ({ row }) => {
        return <div>{formatField(row.getValue("referenceCompanies"))}</div>;
      },
    },

    {
      accessorKey: "notes",
      header: "Əlavə qeydlər",
      cell: ({ row }) => {
        return <div>{formatField(row.getValue("notes"))}</div>;
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
                <Link
                  href={`/curation/meetings/edit/${data.id}`}
                  className={"w-full"}
                >
                  Dəyiş
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  CurationMeetingApi.deleteCurationMeeting(
                    row.original.id,
                  ).then(() => refetch());
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
        <PageTitle>Kurasiya görüşləri</PageTitle>

        <Button
          onClick={() => {
            push("/curation/meetings/add");
          }}
        >
          Əlavə et
        </Button>
      </div>
      <DataTable data={data?.data} columns={columns} />
    </div>
  );
}
