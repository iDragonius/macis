"use client";
import React, { FC, ReactNode } from "react";
import { IconProps, Icons } from "@/components/icons";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { cn, getRole } from "@/lib/utils";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { UserApi } from "@/lib/api/user.api";

export interface SidebarProps {}
export type NavigationProps = {
  label: string;
  url: string;
};
const Sidebar: FC<SidebarProps> = () => {
  const pathname = usePathname();
  const { push } = useRouter();

  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: UserApi.me,
  });
  const navigationData: NavigationProps[] = [
    {
      label: "İstifadəçilər",
      url: "/users",
    },
    {
      label: "Müştərilər",
      url: `/customers`,
    },
    {
      label: "Aktiv müştərilər",
      url: `/active-customers`,
    },
    {
      label: "İtirilmiş müştərilər",
      url: `/lost-customers`,
    },
    {
      label: "Potensial müştərilər",
      url: `/potential-customers`,
    },
    {
      label: "Zəng qrafiki",
      url: `/call-schedule`,
    },
    {
      label: "Zəng rədd qrafiki",
      url: `/call-schedule/refused`,
    },
    {
      label: "Zəng təqib qrafiki",
      url: `/call-schedule/will-be-followed`,
    },
    {
      label: "Günlük zəng qrafiki",
      url: `/daily-call-schedule`,
    },

    {
      label: "Görüş qrafiki",
      url: `/meeting-schedule`,
    },
    {
      label: "Görüş rədd qrafiki",
      url: `/meeting-schedule/refused`,
    },
    {
      label: "Görüş təqib qrafiki",
      url: `/meeting-schedule/will-be-followed`,
    },
    {
      label: "Günlük görüş qrafiki",
      url: `/daily-meeting-schedule`,
    },

    // {
    //   label: "Kurasiya zəngləri",
    //   url: `/potential-customers`,
    // },
    // {
    //   label: "Aylıq hədəf qrafiki",
    //   url: `/potential-customers`,
    // },
  ];

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    push("/sign-in");
  }

  return (
    <div
      className={
        "w-[260px] border-r border-r-neutral-100  h-screen max-h-screen min-h-screen p-4  flex flex-col justify-between bg-blue-500"
      }
    >
      <div>
        <div className={"flex justify-center items-center "}>
          <Image src={"/logo.png"} width={300} height={200} alt={"logo"} />
        </div>

        <div className={"flex flex-col gap-1 mt-12"}>
          {navigationData.map((nav) => (
            <Link
              href={nav.url}
              key={nav.url}
              className={cn(
                "h-[48px]   gap-2 px-2 w-[228px] font-medium leading-[120%] flex items-center rounded-[8px] trans text-white hover:bg-white hover:text-blue-600",
              )}
            >
              {nav.label}
            </Link>
          ))}
        </div>
      </div>
      <div className={"flex flex-col gap-2"}>
        <button
          onClick={logout}
          className={
            "flex justify-between items-center w-[228px] h-[52px] px-4 text-white hover:!text-blue-600 hover:bg-neutral-100 hover:text-neutral-600 trans rounded-[12px] group"
          }
        >
          <div className={"flex gap-2 items-center"}>
            <p className={"font-medium  leading-[120%]"}>Çıxış</p>
          </div>
        </button>
        <div className={"flex gap-3 items-center px-3 py-2"}>
          <div className={"w-[50px] h-[50px] bg-white rounded-full"} />
          <div className={"flex flex-col gap-1"}>
            <h3
              className={"text-white text-[14px] font-semibold leading-[120%]"}
            >
              {user?.data?.profile?.firstName +
                " " +
                user?.data?.profile?.lastName}
            </h3>
            <p className={"text-white text-[13px] leading-[120%] capitalize"}>
              {getRole(user?.data?.role)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
