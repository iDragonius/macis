import Sidebar from "@/app/(main)/components/layout/sidebar";
import Providers from "@/app/providers";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={"flex max-h-[100vh] max-w-[100vw] overflow-hidden"}>
      <Providers>
        <Sidebar />
        <div className={" box overflow-y-scroll"}>{children}</div>
      </Providers>
    </div>
  );
}
