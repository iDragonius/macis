import { Sidebar } from "@/app/(auth)/components/layout/sidebar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={"flex"}>
      <Sidebar />
      <div className={"p-6 bg-gray-100 w-full h-screen"}>{children}</div>
    </div>
  );
}
