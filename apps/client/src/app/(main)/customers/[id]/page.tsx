"use client";
import { useQuery } from "@tanstack/react-query";
import { CustomerApi } from "@/lib/api/customer.api";
import { PageTitle } from "@/components/ui/page-title";
import { CustomerStatus } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Customer({ params }: { params: { id: string } }) {
  const { data, refetch } = useQuery({
    queryKey: ["customer", params.id],
    queryFn: () => CustomerApi.getCustomer(params.id),
  });
  return (
    <div>
      <div className={"flex justify-between items-center"}>
        <PageTitle>{data?.data.company}</PageTitle>
        <Select
          onValueChange={(value) => {
            CustomerApi.changeCustomerStatus(
              params.id,
              value as CustomerStatus,
            ).then((res) => {
              refetch();
            });
          }}
          value={data?.data.status}
        >
          <SelectTrigger className={"max-w-[150px]"}>
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ACTIVE">Aktiv</SelectItem>
            <SelectItem value="POTENTIAL">Potensial</SelectItem>
            <SelectItem value="LOST">İtirilmiş</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
