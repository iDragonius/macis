"use client";
import Sidebar from "@/app/(main)/components/layout/sidebar";
import Providers from "@/app/providers";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { push } = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!localStorage.getItem("token")) {
        push("/sign-in");
      }
    }
  }, []);
  return (
    <div className={"flex max-h-[100vh] max-w-[100vw] overflow-hidden"}>
      <Providers>
        <Sidebar />
        <div className={" box overflow-y-scroll"}>{children}</div>
      </Providers>
    </div>
  );
}
