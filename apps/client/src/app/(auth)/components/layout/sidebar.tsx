import React, { FC } from "react";
import { Icons } from "@/components/icons";
import Image from "next/image";

interface SidebarProps {}

export const Sidebar: FC<SidebarProps> = () => {
  return (
    <div
      className={
        "w-[500px] bg-blue-600 h-screen flex items-center justify-center"
      }
    >
      <Image src={"/logo.png"} width={300} height={200} alt={"logo"} />
    </div>
  );
};
