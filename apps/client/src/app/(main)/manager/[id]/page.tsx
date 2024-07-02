"use client";
import { useQuery } from "@tanstack/react-query";
import { UserApi } from "@/lib/api/user.api";
import { PageTitle } from "@/components/ui/page-title";
import { useEffect, useState } from "react";
import { formatDate, formatField } from "@/lib/utils";
import {
  CallProps,
  CallResult,
  MeetingProps,
  MeetingResult,
} from "@/lib/types";
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
import { MeetingScheduleApi } from "@/lib/api/meeting-schedule.api";
import toast from "react-hot-toast";
import { DataTable } from "@/components/ui/data-table";
import { CallScheduleApi } from "@/lib/api/call-schedule.api";

const contractSignedMeetingColumns: ColumnDef<MeetingProps>[] = [
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
];
const refusedMeetingColumns: ColumnDef<MeetingProps>[] = [
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
    accessorKey: "notes",
    header: "Əlavə qeydlər",
    cell: ({ row }) => {
      return <div>{formatField(row.getValue("notes"))}</div>;
    },
  },
];
const followedMeetingColumns: ColumnDef<MeetingProps>[] = [
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
];

const refusedCallColumns: ColumnDef<CallProps>[] = [
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
];

const followedCallColumns: ColumnDef<CallProps>[] = [
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
];

export default function Page({ params }: { params: { id: string } }) {
  const { data } = useQuery({
    queryKey: ["manager", params.id],
    queryFn: () => UserApi.getUser(params.id),
  });
  const [meetings, setMeetings] = useState<{
    refusedMeetings: any[];
    contractSignedMeetings: any[];
    followedMeetings: any[];
  }>({
    refusedMeetings: [],
    contractSignedMeetings: [],
    followedMeetings: [],
  });

  const [calls, setCalls] = useState<{
    refusedCalls: any[];
    followedCalls: any[];
  }>({
    refusedCalls: [],
    followedCalls: [],
  });
  const [information, setInformation] = useState<[string, string][]>([]);
  useEffect(() => {
    if (data) {
      let customerCount = data?.data?.customers?.length || 0;
      let meetingCount = 0;
      let successfulMeetingCount = 0;
      let refusedMeetingCount = 0;
      let followingMeetingCount = 0;
      let totalAmount = 0;
      const refusedMeetings: any[] = [];
      const contractSignedMeetings: any[] = [];
      const followedMeetings: any[] = [];
      const followedCalls: any[] = [];
      const refusedCalls: any[] = [];
      data?.data?.customers?.map((customer: any) => {
        meetingCount += customer?.meetings?.length;
        customer?.meetings?.map((meeting: any) => {
          if (meeting.result === MeetingResult.REFUSED) {
            refusedMeetingCount++;
            refusedMeetings.push(meeting);
          } else if (meeting.result === MeetingResult.WILL_BE_FOLLOWED) {
            followingMeetingCount++;
            followedMeetings.push(meeting);
          } else if (meeting.result === MeetingResult.CONTRACT_SIGNED) {
            totalAmount += customer?.paymentAmount || 0;
            contractSignedMeetings.push(meeting);
            successfulMeetingCount++;
          }
        });

        customer?.calls?.map((call: any) => {
          if (call.result === CallResult.REFUSED) {
            refusedCalls.push(call);
          } else if (call.result === MeetingResult.WILL_BE_FOLLOWED) {
            followedCalls.push(call);
          }
        });
      });
      setInformation([
        [
          "Tam adı",
          formatField(
            data?.data?.profile?.firstName +
              " " +
              data?.data?.profile?.lastName,
          ),
        ],
        ["E-poçt", formatField(data?.data?.email)],
        ["Müştəri sayı", customerCount],
        ["Ümumi görüş sayı", meetingCount],
        ["Rədd görüş sayı", refusedMeetingCount],
        ["Təqib olunan görüş sayı", followingMeetingCount],
        ["Müqavilə sayı", successfulMeetingCount],
        ["Toplam məbləğ", totalAmount],
      ]);
      setMeetings({
        contractSignedMeetings,
        refusedMeetings,
        followedMeetings,
      });
      setCalls({
        refusedCalls,
        followedCalls,
      });
    }
  }, [data]);
  return (
    <div>
      <PageTitle>Menecer məlumatları</PageTitle>
      <div className={"py-3 border-b "}>
        <div
          className={
            "flex flex-col border rounded-[12px] gap-1 py-4 px-8 w-max"
          }
        >
          {information.map(([key, value]) => (
            <div className={"flex gap-4 "} key={key}>
              <h3 className={"w-[200px] font-medium"}>{key}</h3>
              <p>{value}</p>
            </div>
          ))}
        </div>
      </div>
      <div className={"py-3 border-b"}>
        <h2 className={"text-[22px] font-semibold"}>
          Müqavilə bağlanmış görüşlər
        </h2>
        <DataTable
          data={meetings.contractSignedMeetings}
          columns={contractSignedMeetingColumns}
        />
      </div>
      <div className={"py-3 border-b"}>
        <h2 className={"text-[22px] font-semibold"}>Təqib olunan görüşlər</h2>
        <DataTable
          data={meetings.followedMeetings}
          columns={followedMeetingColumns}
        />
      </div>
      <div className={"py-3 border-b"}>
        <h2 className={"text-[22px] font-semibold"}>Rədd edilmiş görüşlər</h2>

        <DataTable
          data={meetings.refusedMeetings}
          columns={refusedMeetingColumns}
        />
      </div>{" "}
      <div className={"py-3 border-b"}>
        <h2 className={"text-[22px] font-semibold"}>Təqib olunan zənglər</h2>

        <DataTable data={calls.followedCalls} columns={followedCallColumns} />
      </div>{" "}
      <div className={"py-3 border-b"}>
        <h2 className={"text-[22px] font-semibold"}>Rədd edilmiş zənglər</h2>

        <DataTable data={calls.followedCalls} columns={refusedCallColumns} />
      </div>
    </div>
  );
}
