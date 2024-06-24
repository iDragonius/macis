"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FormEvent, useState } from "react";
import { AuthApi, SignInDto } from "@/lib/api/auth.api";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const { push } = useRouter();
  const [data, setData] = useState<SignInDto>({
    email: "",
    password: "",
  });
  const t = "t";
  function signIn(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    AuthApi.signIn(data).then((res) => {
      localStorage.setItem("token", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      push("/");
    });
  }
  return (
    <div className={"w-full h-full flex items-center justify-center"}>
      <div className={"w-[600px]"}>
        <h1 className={"text-blue-600 text-[40px] font-semibold text-center"}>
          Daxil ol
        </h1>
        <form className={"flex flex-col gap-2"} onSubmit={signIn}>
          <div>
            <Label>E-mail</Label>
            <Input
              value={data.email}
              onChange={(e) =>
                setData((prevState) => ({
                  ...prevState,
                  email: e.target.value,
                }))
              }
              type={"tel"}
              placeholder={"example@gmail.com"}
              className={"w-full"}
            />
          </div>
          <div>
            <Label>Şifrə</Label>
            <Input
              value={data.password}
              onChange={(e) =>
                setData((prevState) => ({
                  ...prevState,
                  password: e.target.value,
                }))
              }
              type={"password"}
              placeholder={"Şifrənizi daxil edin"}
              className={"w-full"}
            />
          </div>
          <Button className={"mt-3"}>Daxil ol</Button>
        </form>
      </div>
    </div>
  );
}
