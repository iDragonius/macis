"use client";
import { useQuery } from "@tanstack/react-query";
import { UserApi } from "@/lib/api/user.api";
import { PageTitle } from "@/components/ui/page-title";
import { ReactNode, useEffect, useState } from "react";
import { cn, formatDate, formatField, formatMonth } from "@/lib/utils";
import {
  CallProps,
  CallResult,
  MeetingProps,
  MeetingResult,
  MonthlyTarget,
} from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

import { useRouter } from "next/navigation";
import { DataTable } from "@/components/ui/data-table";
import { MonthlyTargetApi } from "@/lib/api/monthly-target.api";

const contractSignedMeetingColumns: ColumnDef<MeetingProps>[] = [
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
    accessorKey: "reasonForRejection",
    header: "Rədd etmə səbəbi",
    cell: ({ row }) => {
      return <div>{formatField(row.getValue("reasonForRejection"))}</div>;
    },
  },
  {
    accessorKey: "category.name",
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

const monthlyTargetColumns: ColumnDef<MonthlyTarget>[] = [
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
];

type SectionType =
  | "MAIN"
  | "SALES_TRAININGS"
  | "DAILY_REPORT"
  | "WEEKLY_REPORT"
  | "MONTHLY_REPORT"
  | "ANNUAL_REPORT"
  | "GENERAL_INFORMATION"
  | "MONTHLY_TARGET";
export default function Page({ params }: { params: { id: string } }) {
  const { data } = useQuery({
    queryKey: ["manager", params.id],
    queryFn: () => UserApi.getUser(params.id),
  });

  const { data: monthlyTargetData } = useQuery({
    queryKey: ["manager-monthly-target", params.id],
    queryFn: () => MonthlyTargetApi.getMonthlyTargetByManager(params.id),
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
  const { push } = useRouter();
  const sections: {
    section: SectionType;
    label: string;
  }[] = [
    {
      section: "DAILY_REPORT",
      label: "Günlük hesabat",
    },
    {
      section: "WEEKLY_REPORT",
      label: "Həfətlik hesabat",
    },
    {
      section: "MONTHLY_REPORT",
      label: "Aylıq hesabat",
    },
    {
      section: "ANNUAL_REPORT",
      label: "İllik hesabat",
    },
    {
      section: "SALES_TRAININGS",
      label: "Satış təlimləri",
    },
    {
      section: "MONTHLY_TARGET",
      label: "Aylıq hədəf qrafiki",
    },
    {
      section: "GENERAL_INFORMATION",
      label: "Ümumi məlumatlar",
    },
  ];
  const [activeSection, setActiveSection] = useState<SectionType>("MAIN");
  return (
    <div>
      <div className={"flex gap-5 items-center "}>
        <div
          className={
            "w-14 h-14 flex items-center justify-center rounded-full bg-gray-100 text-[20px] font-medium"
          }
        >
          {data?.data?.profile?.firstName[0].toUpperCase() +
            data?.data?.profile?.lastName[0].toUpperCase()}
        </div>
        <div>
          <h1 className={"text-[28px] font-semibold"}>
            {data?.data?.profile?.firstName +
              " " +
              data?.data?.profile?.lastName}
          </h1>
          <p>Menecer</p>
        </div>
      </div>
      <hr className={"my-6"} />
      {activeSection === "MAIN" && (
        <div className={"grid grid-cols-3 gap-6"}>
          {sections.map((section, i) => (
            <button
              onClick={() => {
                if (section.section === "SALES_TRAININGS") {
                  push("/manager/sales-trainings");
                  return;
                }
                setActiveSection(section.section);
              }}
              key={i}
              className={
                "w-full text-blue-600 border border-[#D0D5DD] rounded-[16px] h-[140px] text-left p-6 text-[20px] font-medium hover:bg-blue-600 hover:text-white transition-all ease-in-out"
              }
            >
              {section.label}
            </button>
          ))}
        </div>
      )}{" "}
      {activeSection === "DAILY_REPORT" && (
        <div>
          <button
            onClick={() => setActiveSection("MAIN")}
            className={
              "flex items-center gap-2 text-[18px] text-[#475467] font-semibold"
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M15.8334 9.99996H4.16675M4.16675 9.99996L10.0001 15.8333M4.16675 9.99996L10.0001 4.16663"
                stroke="#475467"
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Geri
          </button>
        </div>
      )}{" "}
      {activeSection === "WEEKLY_REPORT" && (
        <div>
          <button
            onClick={() => setActiveSection("MAIN")}
            className={
              "flex items-center gap-2 text-[18px] text-[#475467] font-semibold"
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M15.8334 9.99996H4.16675M4.16675 9.99996L10.0001 15.8333M4.16675 9.99996L10.0001 4.16663"
                stroke="#475467"
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Geri
          </button>
          <div className={"mt-7"}>
            <ExpandableTable title={"Müqavilə bağlanmış görüşlər"}>
              <DataTable data={[]} columns={contractSignedMeetingColumns} />
            </ExpandableTable>

            <ExpandableTable title={"Təqib olunan görüşlər"}>
              <DataTable data={[]} columns={followedMeetingColumns} />
            </ExpandableTable>
            <ExpandableTable title={"Rədd edilmiş görüşlər"}>
              <DataTable data={[]} columns={refusedMeetingColumns} />
            </ExpandableTable>

            <ExpandableTable title={"Təqib olunan zənglər"}>
              <DataTable data={[]} columns={followedCallColumns} />
            </ExpandableTable>
            <ExpandableTable title={"Rədd edilmiş zənglər"}>
              <DataTable data={[]} columns={refusedCallColumns} />
            </ExpandableTable>
          </div>
        </div>
      )}{" "}
      {activeSection === "MONTHLY_REPORT" && (
        <div>
          <button
            onClick={() => setActiveSection("MAIN")}
            className={
              "flex items-center gap-2 text-[18px] text-[#475467] font-semibold"
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M15.8334 9.99996H4.16675M4.16675 9.99996L10.0001 15.8333M4.16675 9.99996L10.0001 4.16663"
                stroke="#475467"
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Geri
          </button>
          <div className={"mt-7"}>
            <ExpandableTable title={"Müqavilə bağlanmış görüşlər"}>
              <DataTable
                data={meetings.contractSignedMeetings}
                columns={contractSignedMeetingColumns}
              />
            </ExpandableTable>

            <ExpandableTable title={"Təqib olunan görüşlər"}>
              <DataTable
                data={meetings.followedMeetings}
                columns={followedMeetingColumns}
              />
            </ExpandableTable>
            <ExpandableTable title={"Rədd edilmiş görüşlər"}>
              <DataTable
                data={meetings.refusedMeetings}
                columns={refusedMeetingColumns}
              />
            </ExpandableTable>

            <ExpandableTable title={"Təqib olunan zənglər"}>
              <DataTable
                data={calls.followedCalls}
                columns={followedCallColumns}
              />
            </ExpandableTable>
            <ExpandableTable title={"Rədd edilmiş zənglər"}>
              <DataTable
                data={calls.refusedCalls}
                columns={refusedCallColumns}
              />
            </ExpandableTable>
          </div>
        </div>
      )}{" "}
      {activeSection === "ANNUAL_REPORT" && (
        <div>
          <button
            onClick={() => setActiveSection("MAIN")}
            className={
              "flex items-center gap-2 text-[18px] text-[#475467] font-semibold"
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M15.8334 9.99996H4.16675M4.16675 9.99996L10.0001 15.8333M4.16675 9.99996L10.0001 4.16663"
                stroke="#475467"
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Geri
          </button>
          <div className={"mt-7"}>
            <ExpandableTable title={"Müqavilə bağlanmış görüşlər"}>
              <DataTable
                data={meetings.contractSignedMeetings}
                columns={contractSignedMeetingColumns}
              />
            </ExpandableTable>

            <ExpandableTable title={"Təqib olunan görüşlər"}>
              <DataTable
                data={meetings.followedMeetings}
                columns={followedMeetingColumns}
              />
            </ExpandableTable>
            <ExpandableTable title={"Rədd edilmiş görüşlər"}>
              <DataTable
                data={meetings.refusedMeetings}
                columns={refusedMeetingColumns}
              />
            </ExpandableTable>

            <ExpandableTable title={"Təqib olunan zənglər"}>
              <DataTable
                data={calls.followedCalls}
                columns={followedCallColumns}
              />
            </ExpandableTable>
            <ExpandableTable title={"Rədd edilmiş zənglər"}>
              <DataTable
                data={calls.refusedCalls}
                columns={refusedCallColumns}
              />
            </ExpandableTable>
          </div>
        </div>
      )}{" "}
      {activeSection === "GENERAL_INFORMATION" && (
        <div>
          <button
            onClick={() => setActiveSection("MAIN")}
            className={
              "flex items-center gap-2 text-[18px] text-[#475467] font-semibold"
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M15.8334 9.99996H4.16675M4.16675 9.99996L10.0001 15.8333M4.16675 9.99996L10.0001 4.16663"
                stroke="#475467"
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Geri
          </button>
          <div className={"mt-7"}>
            <ExpandableTable title={"Müqavilə bağlanmış görüşlər"}>
              <DataTable
                data={meetings.contractSignedMeetings}
                columns={contractSignedMeetingColumns}
              />
            </ExpandableTable>

            <ExpandableTable title={"Təqib olunan görüşlər"}>
              <DataTable
                data={meetings.followedMeetings}
                columns={followedMeetingColumns}
              />
            </ExpandableTable>
            <ExpandableTable title={"Rədd edilmiş görüşlər"}>
              <DataTable
                data={meetings.refusedMeetings}
                columns={refusedMeetingColumns}
              />
            </ExpandableTable>

            <ExpandableTable title={"Təqib olunan zənglər"}>
              <DataTable
                data={calls.followedCalls}
                columns={followedCallColumns}
              />
            </ExpandableTable>
            <ExpandableTable title={"Rədd edilmiş zənglər"}>
              <DataTable
                data={calls.refusedCalls}
                columns={refusedCallColumns}
              />
            </ExpandableTable>
          </div>
        </div>
      )}
      {activeSection === "MONTHLY_TARGET" && (
        <div>
          <button
            onClick={() => setActiveSection("MAIN")}
            className={
              "flex items-center gap-2 text-[18px] text-[#475467] font-semibold"
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M15.8334 9.99996H4.16675M4.16675 9.99996L10.0001 15.8333M4.16675 9.99996L10.0001 4.16663"
                stroke="#475467"
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Geri
          </button>

          <DataTable
            data={monthlyTargetData?.data}
            columns={monthlyTargetColumns}
          />
        </div>
      )}
    </div>
  );
}

const ExpandableTable = ({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div className={" border-b  "}>
      <div
        onClick={() => setOpen((prevState) => !prevState)}
        className={
          "flex justify-between items-center transition-all ease-in-out hover:bg-gray-100 py-3 px-3"
        }
      >
        <h2 className={"text-[22px] font-semibold"}>{title}</h2>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          className={cn(open ? "rotate-180" : "")}
        >
          <path
            d="M6 9L12 15L18 9"
            stroke="black"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {open && <div className={"px-3"}>{children}</div>}
    </div>
  );
};
