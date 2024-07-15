"use client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { CallResultType, CallScheduleApi } from "@/lib/api/call-schedule.api";
import { ColumnDef } from "@tanstack/react-table";
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
import { DataTable } from "@/components/ui/data-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CallProps, CallResult } from "@/lib/types";
import { useRouter } from "next/navigation";
import { MeetingScheduleApi } from "@/lib/api/meeting-schedule.api";
import toast from "react-hot-toast";
import { CurationCallApi } from "@/lib/api/curation-call.api";
import useConfirmationDialog from "@/hooks/use-confirmation-dialog";

export default function CallSchedule() {
  const [result, setResult] = useState<CallResultType | null>(null);
  const { data, refetch } = useQuery({
    queryKey: ["calls", result],
    queryFn: () => CallScheduleApi.getAllCalls(result),
  });
  const { setDialogState } = useConfirmationDialog();

  const callColumns: ColumnDef<CallProps>[] = [
    {
      accessorKey: "customer.company",
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
      accessorKey: "customer.head",
      header: "Rəhbər",
      cell: ({ row }) => {
        const head = row.original.customer.head;
        return <div>{formatField(head)}</div>;
      },
    },
    {
      accessorKey: "customer.position",
      header: "Vəzifəsi",
      cell: ({ row }) => {
        const head = row.original.customer.position;
        return <div>{formatField(head)}</div>;
      },
    },
    {
      accessorKey: "customer.contactNumber",
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
      accessorKey: "result",
      header: "Nəticə",
      cell: ({ row }) => {
        return (
          <Select
            value={row.original.result}
            onValueChange={(value) => {
              CallScheduleApi.changeCallResult(
                value as CallResultType,
                row.original.id,
              ).then((res) => {
                refetch();
              });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Nəticə" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={CallResult.UNKNOWN}>Məlumat yoxdur</SelectItem>{" "}
              <SelectItem value={CallResult.WILL_BE_MEETING}>
                Görüş olacaq
              </SelectItem>{" "}
              <SelectItem value={CallResult.WILL_BE_FOLLOWED}>
                Təqib olunacaq
              </SelectItem>{" "}
              <SelectItem value={CallResult.REFUSED}>İstəmir</SelectItem>
            </SelectContent>
          </Select>
        );
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
                  setDialogState({
                    isOpen: true,
                    confirmFunction() {
                      CallScheduleApi.deleteCall(data.id).then(() => {
                        refetch();
                        toast.success("Zəng uğurla silindi!");
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

  const { push } = useRouter();
  return (
    <div>
      <div className={"flex items-center justify-between"}>
        <PageTitle>Zəng qrafiki</PageTitle>
        <div className={"flex items-center gap-4"}>
          {/*<Select*/}
          {/*  onValueChange={(value) => {*/}
          {/*    if (value === "ALL") {*/}
          {/*      setResult(null);*/}
          {/*    } else {*/}
          {/*      setResult(value as CallResultType);*/}
          {/*    }*/}
          {/*  }}*/}
          {/*  value={result || "ALL"}*/}
          {/*>*/}
          {/*  <SelectTrigger className={"w-[200px]"}>*/}
          {/*    <SelectValue placeholder="" />*/}
          {/*  </SelectTrigger>*/}
          {/*  <SelectContent>*/}
          {/*    <SelectItem value="ALL">Hamısı</SelectItem>*/}

          {/*    <SelectItem value="WILL_BE_MEETING">Görüşüləcək</SelectItem>*/}
          {/*    <SelectItem value="WILL_BE_FOLLOWED">Təqib olunacaq</SelectItem>*/}
          {/*    <SelectItem value="REFUSED">İtirilmiş</SelectItem>*/}
          {/*  </SelectContent>*/}
          {/*</Select>*/}
          <Button
            onClick={() => {
              push("/call-schedule/add");
            }}
          >
            Yeni zəng
          </Button>
        </div>
      </div>
      <DataTable data={data?.data} columns={callColumns} />
    </div>
  );
}
