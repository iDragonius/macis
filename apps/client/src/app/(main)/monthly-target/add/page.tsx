"use client";
import { PageTitle } from "@/components/ui/page-title";
import { useQuery } from "@tanstack/react-query";
import { UserApi } from "@/lib/api/user.api";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MonthlyTargetApi } from "@/lib/api/monthly-target.api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
const months = [
  {
    value: "January",
    label: "Yanvar",
  },
  {
    value: "February",
    label: "Fevral",
  },
  {
    value: "March",
    label: "Mart",
  },
  {
    value: "April",
    label: "Aprel",
  },
  {
    value: "May",
    label: "May",
  },
  {
    value: "June",
    label: "İyun",
  },
  {
    value: "July",
    label: "İyul",
  },
  {
    value: "August",
    label: "Avqust",
  },
  {
    value: "September",
    label: "Sentyabr",
  },
  {
    value: "October",
    label: "Oktyabr",
  },
  {
    value: "November",
    label: "Noyabr",
  },
  {
    value: "December",
    label: "Dekabr",
  },
];

type MonthlyTargetDto = {
  managerId: string | null;
  meetingTarget: number;
  month: string | null;
};
export default function AddMonthlyTarget() {
  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: UserApi.getAllUsers,
  });

  const [data, setData] = useState<MonthlyTargetDto>({
    managerId: null,
    month: null,
    meetingTarget: 0,
  });
  const { push } = useRouter();
  function save() {
    MonthlyTargetApi.createMonthlyTarget(data).then((res) => {
      push("/monthly-target");
      toast.success("Aylıq hədəf uğurla  yaradıldı");
    });
  }

  return (
    <div>
      <PageTitle>Yeni aylıq hədəf</PageTitle>

      <div className={"mt-5 grid grid-cols-2 gap-8"}>
        <div>
          <Label>Menecer</Label>
          <Select
            onValueChange={(value) =>
              setData((prevState) => ({
                ...prevState,
                managerId: value,
              }))
            }
            value={data.managerId || undefined}
          >
            <SelectTrigger>
              <SelectValue placeholder="Meneceri seçin" />
            </SelectTrigger>
            <SelectContent>
              {users?.data.map((user: any) => {
                return (
                  <SelectItem value={user.id} key={user.id}>
                    {user?.profile?.firstName + " " + user?.profile?.lastName}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Ay</Label>
          <Select
            onValueChange={(value) =>
              setData((prevState) => ({
                ...prevState,
                month: value,
              }))
            }
            value={data.month || undefined}
          >
            <SelectTrigger>
              <SelectValue placeholder="Ayı seçin" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month: any) => {
                return (
                  <SelectItem value={month.value} key={month.value}>
                    {month.label}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Görüş hədəfi</Label>
          <Input
            value={data.meetingTarget || undefined}
            onChange={(e) =>
              setData((prevState) => ({
                ...prevState,
                meetingTarget: +e.target.value,
              }))
            }
            type={"number"}
            placeholder={"Görüş hədəfi"}
          />
        </div>
      </div>
      <Button className={"mt-8 float-right"} onClick={save}>
        Yadda saxla
      </Button>
    </div>
  );
}
