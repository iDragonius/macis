"use client";
import Sidebar from "@/app/(main)/components/layout/sidebar";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { push } = useRouter();
  useEffect(() => {
    push("/sign-in");
  }, []);
  return (
    <div className={"flex max-h-[100vh] max-w-[100vw] overflow-hidden"}>
      <Sidebar />
      <div className={" box overflow-y-scroll"}>
        <Toaster />
        {children}
      </div>
    </div>
  );
}
