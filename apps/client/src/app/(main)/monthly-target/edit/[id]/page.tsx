"use client";
import { useQuery } from "@tanstack/react-query";
import { UserApi } from "@/lib/api/user.api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MonthlyTargetApi } from "@/lib/api/monthly-target.api";
import toast from "react-hot-toast";
import { PageTitle } from "@/components/ui/page-title";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { months, years } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
type MonthlyTargetDto = {
  managerId: string | null;
  meetingTarget: number;
  month: string | null;
  year: string | null;
};
export default function Page({ params }: { params: { id: string } }) {
  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: UserApi.getAllUsers,
  });
  const { data: monthlyTarget } = useQuery({
    queryKey: ["monthly-target", params.id],
    queryFn: () => MonthlyTargetApi.getMonthlyTarget(params.id),
  });
  const [data, setData] = useState<MonthlyTargetDto>({
    managerId: null,
    month: null,
    meetingTarget: 0,
    year: null,
  });
  const { push } = useRouter();
  useEffect(() => {
    if (monthlyTarget) {
      setData({
        month: monthlyTarget.data.month,
        year: monthlyTarget.data.year,
        managerId: monthlyTarget.data.managerId,
        meetingTarget: monthlyTarget.data.meetingTarget,
      });
    }
  }, [monthlyTarget]);
  function save() {
    MonthlyTargetApi.updateMonthlyTarget(data, params.id).then(() => {
      push("/monthly-target");
      toast.success("Aylıq hədəf məlumatları uğurla  dəyişdirildi!");
    });
  }
  return (
    <div>
      <PageTitle>Aylıq hədəfi dəyiş</PageTitle>

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
          <Label>İl</Label>
          <Select
            onValueChange={(value) =>
              setData((prevState) => ({
                ...prevState,
                year: value,
              }))
            }
            value={data.year || undefined}
          >
            <SelectTrigger>
              <SelectValue placeholder="İli seçin" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year: any) => {
                return (
                  <SelectItem value={year} key={year}>
                    {year}
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
