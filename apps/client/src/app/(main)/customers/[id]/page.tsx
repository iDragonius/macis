"use client";
import { useQuery } from "@tanstack/react-query";
import { CustomerApi } from "@/lib/api/customer.api";
import { PageTitle } from "@/components/ui/page-title";

export default function Customer({ params }: { params: { id: string } }) {
  const { data } = useQuery({
    queryKey: ["customer", params.id],
    queryFn: () => CustomerApi.getCustomer(params.id),
  });
  return (
    <div>
      <div className={"flex justify-between items-center"}>
        <PageTitle>{data?.data.company}</PageTitle>
      </div>
    </div>
  );
}
