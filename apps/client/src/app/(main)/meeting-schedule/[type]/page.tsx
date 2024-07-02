"use client";
import {
  MeetingResultType,
  MeetingScheduleApi,
  MeetingTypes,
} from "@/lib/api/meeting-schedule.api";
import { ColumnDef } from "@tanstack/react-table";
import { MeetingProps } from "@/lib/types";
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
import { Button } from "@/components/ui/button";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { DataTable } from "@/components/ui/data-table";
import { useQuery } from "@tanstack/react-query";
import { PageTitle } from "@/components/ui/page-title";
import toast from "react-hot-toast";
import { CustomerApi } from "@/lib/api/customer.api";
import useConfirmationDialog from "@/hooks/use-confirmation-dialog";

export default function MeetingScheduleType({
  params,
}: {
  params: { type: MeetingResultType };
}) {
  const { data, refetch } = useQuery({
    queryKey: ["calls", params.type],
    queryFn: () => MeetingScheduleApi.getAllMeetings(MeetingTypes[params.type]),
  });
  const MeetingTypeNames: Record<string, string> = {
    refused: "Görüş rədd qrafiki",
    "will-be-followed": "Görüş təqib qrafiki",
  };
  const { setDialogState } = useConfirmationDialog();

  const contractSignedMeetingColumns: ColumnDef<MeetingProps>[] = [
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
        const company = row.original.customer.company;
        return (
          <Link
            href={`/customers/${row.original.customer.id}`}
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
        const head = row.original.customer.head;
        return <div>{formatField(head)}</div>;
      },
    },
    {
      accessorKey: "position",
      header: "Vəzifəsi",
      cell: ({ row }) => {
        const head = row.original.customer.position;
        return <div>{formatField(head)}</div>;
      },
    },
    {
      accessorKey: "contactNumber",
      header: "Əlaqə nömrəsi",
      cell: ({ row }) => {
        const contactNumber = row.original.customer.contactNumber;
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
      header: "Görüş saatı",
      cell: ({ row }) => {
        return <div>{formatField(row.getValue("meetingTime"))}</div>;
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
                  href={`/meeting-schedule/edit/${data.id}`}
                  className={"w-full"}
                >
                  Dəyiş
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setDialogState({
                    isOpen: true,
                    confirmFunction() {
                      MeetingScheduleApi.deleteMeeting(data.id).then(() => {
                        refetch();
                        toast.success("Görüş uğurla silindi!");
                      });
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
  const refusedMeetingColumns: ColumnDef<MeetingProps>[] = [
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
        const company = row.original.customer.company;
        return (
          <Link
            href={`/customers/${row.original.customer.id}`}
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
        const head = row.original.customer.head;
        return <div>{formatField(head)}</div>;
      },
    },
    {
      accessorKey: "position",
      header: "Vəzifəsi",
      cell: ({ row }) => {
        const head = row.original.customer.position;
        return <div>{formatField(head)}</div>;
      },
    },
    {
      accessorKey: "contactNumber",
      header: "Əlaqə nömrəsi",
      cell: ({ row }) => {
        const contactNumber = row.original.customer.contactNumber;
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
      header: "Görüş saatı",
      cell: ({ row }) => {
        return <div>{formatField(row.getValue("meetingTime"))}</div>;
      },
    },
    {
      accessorKey: "reasonForRejection",
      header: "Rədd etmə səbəbi",
      cell: ({ row }) => {
        return <div>{formatField(row.getValue("reasonForRejection"))}</div>;
      },
    },
    {
      accessorKey: "category",
      header: "Kateqoriya",
      cell: ({ row }) => {
        const category = row?.original?.category?.name;
        return <div>{formatField(category)}</div>;
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
                  href={`/meeting-schedule/edit/${data.id}`}
                  className={"w-full"}
                >
                  Dəyiş
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setDialogState({
                    isOpen: true,
                    confirmFunction() {
                      MeetingScheduleApi.deleteMeeting(data.id).then(() => {
                        refetch();
                        toast.success("Görüş uğurla silindi!");
                      });
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
  const followedMeetingColumns: ColumnDef<MeetingProps>[] = [
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
        const company = row.original.customer.company;
        return (
          <Link
            href={`/customers/${row.original.customer.id}`}
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
        const head = row.original.customer.head;
        return <div>{formatField(head)}</div>;
      },
    },
    {
      accessorKey: "position",
      header: "Vəzifəsi",
      cell: ({ row }) => {
        const head = row.original.customer.position;
        return <div>{formatField(head)}</div>;
      },
    },
    {
      accessorKey: "contactNumber",
      header: "Əlaqə nömrəsi",
      cell: ({ row }) => {
        const contactNumber = row.original.customer.contactNumber;
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
      header: "Görüş saatı",
      cell: ({ row }) => {
        return <div>{formatField(row.getValue("meetingTime"))}</div>;
      },
    },
    {
      accessorKey: "nextContactDate",
      header: "Növbəti əlaqə tarixi",
      cell: ({ row }) => {
        return <div>{formatDate(row.getValue("nextContactDate"))}</div>;
      },
    },
    {
      accessorKey: "nextMeetingDate",
      header: "Növbəti görüş tarixi",
      cell: ({ row }) => {
        return <div>{formatDate(row.getValue("nextMeetingDate"))}</div>;
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
                  href={`/meeting-schedule/edit/${data.id}`}
                  className={"w-full"}
                >
                  Dəyiş
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setDialogState({
                    isOpen: true,
                    confirmFunction() {
                      MeetingScheduleApi.deleteMeeting(data.id).then(() => {
                        refetch();
                        toast.success("Görüş uğurla silindi!");
                      });
                    },
                  });
                }}
              >
                Sil
              </DropdownMenuItem>{" "}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  return (
    <div>
      <PageTitle>{MeetingTypeNames[params.type]}</PageTitle>
      {MeetingTypes[params.type] === "WILL_BE_FOLLOWED" && (
        <DataTable data={data?.data} columns={followedMeetingColumns} />
      )}{" "}
      {MeetingTypes[params.type] === "REFUSED" && (
        <DataTable data={data?.data} columns={refusedMeetingColumns} />
      )}
      {MeetingTypes[params.type] === "CONTRACT_SIGNED" && (
        <DataTable data={data?.data} columns={contractSignedMeetingColumns} />
      )}
    </div>
  );
}
