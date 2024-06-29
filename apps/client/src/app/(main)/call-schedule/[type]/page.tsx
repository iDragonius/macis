"use client";
import { DataTable } from "@/components/ui/data-table";
import {
  CallResultType,
  CallScheduleApi,
  CallTypes,
} from "@/lib/api/call-schedule.api";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { CallProps } from "@/lib/types";
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
import { PageTitle } from "@/components/ui/page-title";
import toast from "react-hot-toast";

export default function CallScheduleType({
  params,
}: {
  params: { type: CallResultType };
}) {
  const { data, refetch } = useQuery({
    queryKey: ["calls", params.type],
    queryFn: () => CallScheduleApi.getAllCalls(CallTypes[params.type]),
  });

  const CallTypeNames: Record<string, string> = {
    refused: "Zəng rədd qrafiki",
    "will-be-followed": "Zəng təqib qrafiki",
  };

  const followedCallColumns: ColumnDef<CallProps>[] = [
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
      accessorKey: "contactDate",
      header: "Əlaqə tarixi",
      cell: ({ row }) => {
        return <div>{formatDate(row.getValue("contactDate"))}</div>;
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
                  href={`/call-schedule/edit/${data.id}`}
                  className={"w-full"}
                >
                  Dəyiş
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  CallScheduleApi.deleteCall(data.id).then(() => {
                    refetch();
                    toast.success("Zəng uğurla silindi!");
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
  const refusedCallColumns: ColumnDef<CallProps>[] = [
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
      accessorKey: "contactDate",
      header: "Əlaqə tarixi",
      cell: ({ row }) => {
        return <div>{formatDate(row.getValue("contactDate"))}</div>;
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
                  href={`/call-schedule/edit/${data.id}`}
                  className={"w-full"}
                >
                  Dəyiş
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  CallScheduleApi.deleteCall(data.id).then(() => {
                    refetch();
                    toast.success("Zəng uğurla silindi!");
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

  const meetingCallColumns: ColumnDef<CallProps>[] = [
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
      accessorKey: "contactDate",
      header: "Əlaqə tarixi",
      cell: ({ row }) => {
        return <div>{formatDate(row.getValue("contactDate"))}</div>;
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
                  href={`/call-schedule/edit/${data.id}`}
                  className={"w-full"}
                >
                  Dəyiş
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  CallScheduleApi.deleteCall(data.id).then(() => {
                    refetch();
                    toast.success("Zəng uğurla silindi!");
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
      <PageTitle>{CallTypeNames[params.type]}</PageTitle>
      {CallTypes[params.type] === "WILL_BE_FOLLOWED" && (
        <DataTable data={data?.data} columns={followedCallColumns} />
      )}{" "}
      {CallTypes[params.type] === "REFUSED" && (
        <DataTable data={data?.data} columns={refusedCallColumns} />
      )}
      {CallTypes[params.type] === "WILL_BE_MEETING" && (
        <DataTable data={data?.data} columns={meetingCallColumns} />
      )}
    </div>
  );
}
