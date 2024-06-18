"use client";
import { useQuery } from "@tanstack/react-query";
import { CustomerApi } from "@/lib/api/customer.api";

export default function Customer({ params }: { params: { id: string } }) {
  const { data } = useQuery({
    queryKey: ["customer", params.id],
    queryFn: () => CustomerApi.getCustomer(params.id),
  });
  return (
    <div>
      <div className={"flex justify-between items-center"}>
        <h1 className={"text-[32px] font-semibold"}>{data?.data.company}</h1>
      </div>
    </div>
  );
}
