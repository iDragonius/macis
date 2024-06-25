"use client";
import { useQuery } from "@tanstack/react-query";
import { CustomerApi } from "@/lib/api/customer.api";
import { PageTitle } from "@/components/ui/page-title";
import { CustomerStatus, formatDate, formatField } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ColumnDef } from "@tanstack/react-table";
import { CallProps, MeetingProps } from "@/lib/types";
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
import { useEffect, useState } from "react";

const meetingColumns: ColumnDef<MeetingProps>[] = [
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
    accessorKey: "result",
    header: "Nəticə",
    cell: ({ row }) => {
      let result = row.original.result;

      if (result === "REFUSED") {
        return <div className={"text-red-600 font-semibold"}>İstəmir</div>;
      } else if (result === "WILL_BE_FOLLOWED") {
        return (
          <div className={"text-green-600 font-semibold"}>Təqib olunacaq</div>
        );
      } else if (result === "CONTRACT_SIGNED") {
        return (
          <div className={"text-blue-600 font-semibold"}>Müqavilə bağlandı</div>
        );
      } else {
        return <div className={"font-semibold"}>Bilinmir</div>;
      }
    },
  },
  {
    accessorKey: "notes",
    header: "Əlavə qeydlər",
    cell: ({ row }) => {
      return <div>{formatField(row.getValue("notes"))}</div>;
    },
  },
];

const callColumns: ColumnDef<CallProps>[] = [
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
      let result = row.original.result;

      if (result === "REFUSED") {
        return <div className={"text-red-600 font-semibold"}>İstəmir</div>;
      } else if (result === "WILL_BE_FOLLOWED") {
        return (
          <div className={"text-green-600 font-semibold"}>Təqib olunacaq</div>
        );
      } else if (result === "WILL_BE_MEETING") {
        return <div className={"text-blue-600 font-semibold"}>Görüşüləcək</div>;
      } else {
        return <div className={"font-semibold"}>Bilinmir</div>;
      }
    },
  },
  {
    accessorKey: "notes",
    header: "Əlavə qeydlər",
    cell: ({ row }) => {
      return <div>{formatField(row.getValue("notes"))}</div>;
    },
  },
];

export default function Customer({ params }: { params: { id: string } }) {
  const { data, refetch } = useQuery({
    queryKey: ["customer", params.id],
    queryFn: () => CustomerApi.getCustomer(params.id),
  });

  const [information, setInformation] = useState<[string, string][]>([]);
  useEffect(() => {
    if (data) {
      setInformation([
        ["Rəhbər", formatField(data?.data?.head)],
        ["Vəzifəsi", formatField(data?.data?.position)],
        ["Rəhbərin doğum tarixi", formatDate(data?.data?.ownersBirthday || "")],
        ["Əlaqə nömrəsi", formatField(data?.data?.contactNumber)],
        [
          "Şirkətin yaranma tarixi",
          formatDate(data?.data?.companyEstablishmentDate || ""),
        ],
        ["Müqavilə tarixi", formatDate(data?.data?.contractDate || "")],
        ["Xidmət", formatField(data?.data?.service)],
        ["Ödəniş", formatField(data?.data?.payment)],
      ]);
    }
  }, [data]);
  return (
    <div>
      <div className={"flex justify-between items-center"}>
        <PageTitle>{data?.data.company}</PageTitle>
        <Select
          onValueChange={(value) => {
            CustomerApi.changeCustomerStatus(
              params.id,
              value as CustomerStatus,
            ).then((res) => {
              refetch();
            });
          }}
          value={data?.data.status}
        >
          <SelectTrigger className={"max-w-[150px]"}>
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ACTIVE">Aktiv</SelectItem>
            <SelectItem value="POTENTIAL">Potensial</SelectItem>
            <SelectItem value="LOST">İtirilmiş</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className={"py-3 border-b "}>
        <div
          className={
            "flex flex-col border rounded-[12px] gap-1 py-4 px-8 w-max"
          }
        >
          {information.map(([key, value]) => (
            <div className={"flex gap-4 "}>
              <h3 className={"w-[200px] font-medium"}>{key}</h3>
              <p>{value}</p>
            </div>
          ))}
        </div>
      </div>
      <div className={"py-3 border-b"}>
        <h2 className={"text-[22px] font-semibold"}>Görüşlər</h2>
        <DataTable data={data?.data.meetings || []} columns={meetingColumns} />
      </div>

      <div className={"py-3 border-b"}>
        <h2 className={"text-[22px] font-semibold"}>Zənglər</h2>
        <DataTable data={data?.data.calls || []} columns={callColumns} />
      </div>
    </div>
  );
}
