"use client";
import { PageTitle } from "@/components/ui/page-title";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Gender, Role, UserDto } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CustomerStatus } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { UserApi } from "@/lib/api/user.api";
import { useRouter } from "next/navigation";

export default function Add() {
  const [data, setData] = useState<UserDto>({
    firstName: "",
    lastName: "",
    fatherName: "",
    gender: Gender.MALE,
    password: "",
    repeatPassword: "",
    phoneNumber: "",
    email: "",
    role: Role.USER,
  });
  const { push } = useRouter();
  function save() {
    if (data.repeatPassword !== data.password) {
      toast.error("Daxil etdiyiniz şifrələr eyni deyil!");
    }

    UserApi.createUser({
      firstName: data.firstName,
      lastName: data.lastName,
      fatherName: data.fatherName,
      gender: data.gender,
      role: data.role,
      email: data.email,
      phoneNumber: data.phoneNumber,
      password: data.password,
    }).then((res) => {
      console.log(res);
      toast.success("Yeni istifadəçi uğurla yaradıldı!");
      push("/users");
    });
  }

  console.log(data);
  return (
    <div>
      <PageTitle>Yeni istifadəçi</PageTitle>

      <div className={"mt-5 grid grid-cols-2 gap-8"}>
        <div>
          <Label>Ad</Label>
          <Input
            placeholder={"Ad"}
            value={data.firstName}
            onChange={(e) =>
              setData((prevState) => ({
                ...prevState,
                firstName: e.target.value,
              }))
            }
            type={"text"}
          />
        </div>
        <div>
          <Label>Soyad</Label>
          <Input
            placeholder={"Soyad"}
            value={data.lastName}
            onChange={(e) =>
              setData((prevState) => ({
                ...prevState,
                lastName: e.target.value,
              }))
            }
            type={"text"}
          />
        </div>
        <div>
          <Label>Ata adı</Label>
          <Input
            placeholder={"Ata adı"}
            value={data.fatherName}
            onChange={(e) =>
              setData((prevState) => ({
                ...prevState,
                fatherName: e.target.value,
              }))
            }
            type={"text"}
          />
        </div>
        <div>
          <Label>Email</Label>
          <Input
            placeholder={"Email"}
            value={data.email}
            onChange={(e) =>
              setData((prevState) => ({
                ...prevState,
                email: e.target.value,
              }))
            }
            type={"text"}
          />
        </div>
        <div>
          <Label>Telefon nömrəsi</Label>
          <Input
            placeholder={"Telefon nömrəsi"}
            value={data.phoneNumber}
            onChange={(e) =>
              setData((prevState) => ({
                ...prevState,
                phoneNumber: e.target.value,
              }))
            }
            type={"text"}
          />
        </div>

        <div>
          <Label>Cins</Label>
          <Select
            onValueChange={(value) =>
              setData((prevState) => ({
                ...prevState,
                gender: value as Gender,
              }))
            }
            value={data.gender}
          >
            <SelectTrigger>
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MALE">Kişi</SelectItem>
              <SelectItem value="FEMALE">Qadın</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Rol</Label>
          <Select
            onValueChange={(value) =>
              setData((prevState) => ({
                ...prevState,
                role: value as Role,
              }))
            }
            value={data.role}
          >
            <SelectTrigger>
              <SelectValue placeholder="Rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USER">İzləyici</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Şifrə</Label>
          <Input
            placeholder={"Şifrə"}
            value={data.password}
            onChange={(e) =>
              setData((prevState) => ({
                ...prevState,
                password: e.target.value,
              }))
            }
            type={"password"}
          />
        </div>
        <div>
          <Label>Şifrəni təkrar edin</Label>
          <Input
            placeholder={"Şifrəni təkrar edin"}
            value={data.repeatPassword}
            onChange={(e) =>
              setData((prevState) => ({
                ...prevState,
                repeatPassword: e.target.value,
              }))
            }
            type={"password"}
          />
        </div>
      </div>
      <Button className={"mt-8 float-right"} onClick={save}>
        Yadda saxla
      </Button>
    </div>
  );
}
