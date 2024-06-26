"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CustomerStatus } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CustomerApi } from "@/lib/api/customer.api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { CustomerDto } from "@/lib/types";
import { PageTitle } from "@/components/ui/page-title";
import { useQuery } from "@tanstack/react-query";
import { UserApi } from "@/lib/api/user.api";

export default function CustomerAdd() {
  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: UserApi.getAllUsers,
  });
  const [data, setData] = useState<CustomerDto>({
    company: "",
    head: "",
    contactNumber: "",
    status: "ACTIVE",
    contractDate: "",
    service: "",
    paymentAmount: 0,
    ownersBirthday: "",
    companyEstablishmentDate: "",
    curator: "",
    managerId: "",
    contractExpirationDate: "",
    termsOfPayment: "",
    terminationReason: "",
    position: "",
    source: "",
    notes: "",
  });
  const { push } = useRouter();

  function save() {
    if (data.status === "ACTIVE") {
      CustomerApi.createCustomer({
        company: data.company,
        head: data.head,
        position: data.position,
        contactNumber: data.contactNumber,
        status: data.status,
        contractDate: data.contractDate,
        service: data.service,
        paymentAmount: +data.paymentAmount,
        ownersBirthday: data.ownersBirthday,
        companyEstablishmentDate: data.companyEstablishmentDate,
        curator: data.curator,
        managerId: data.managerId,
      }).then((res) => {
        toast.success("Müştəri uğurla yaradıldı");
        push("/active-customers");
      });
    } else if (data.status === "LOST") {
      CustomerApi.createCustomer({
        company: data.company,
        head: data.head,
        position: data.position,
        contactNumber: data.contactNumber,
        status: data.status,
        contractDate: data.contractDate,
        contractExpirationDate: data.contractExpirationDate,
        termsOfPayment: data.termsOfPayment,
        terminationReason: data.terminationReason,
        service: data.service,
        managerId: data.managerId,
      }).then((res) => {
        toast.success("Müştəri uğurla yaradıldı");
        push("/lost-customers");
      });
    } else {
      CustomerApi.createCustomer({
        company: data.company,
        head: data.head,
        contactNumber: data.contactNumber,
        status: data.status,
        position: data.position,
        source: data.source,
        notes: data.notes,
        service: data.service,
        managerId: data.managerId,
      }).then((res) => {
        toast.success("Müştəri uğurla yaradıldı");
        push("/potential-customers");
      });
    }
  }
  return (
    <div>
      <PageTitle>Yeni müştəri</PageTitle>

      <div>
        <h2 className={"text-[24px] font-medium mt-8"}>Ümumi məlumatlar</h2>
        <div className={"mt-5 grid grid-cols-2 gap-8"}>
          <div>
            <Label>Şirkət</Label>
            <Input
              value={data.company}
              onChange={(e) =>
                setData((prevState) => ({
                  ...prevState,
                  company: e.target.value,
                }))
              }
              type={"text"}
              placeholder={"Şirkət"}
            />
          </div>
          <div>
            <Label>Rəhbər</Label>
            <Input
              value={data.head}
              onChange={(e) =>
                setData((prevState) => ({
                  ...prevState,
                  head: e.target.value,
                }))
              }
              type={"text"}
              placeholder={"Rəhbər"}
            />
          </div>
          <div>
            <Label>Vəzifə</Label>
            <Input
              value={data.position}
              onChange={(e) =>
                setData((prevState) => ({
                  ...prevState,
                  position: e.target.value,
                }))
              }
              type={"text"}
              placeholder={"Vəzifə"}
            />
          </div>{" "}
          <div>
            <Label>Əlaqə nömrəsi</Label>
            <Input
              value={data.contactNumber}
              onChange={(e) =>
                setData((prevState) => ({
                  ...prevState,
                  contactNumber: e.target.value,
                }))
              }
              type={"text"}
              placeholder={"Əlaqə nömrəsi"}
            />
          </div>
          <div>
            <Label>Menecer</Label>
            <Select
              onValueChange={(value) =>
                setData((prevState) => ({
                  ...prevState,
                  managerId: value,
                }))
              }
              value={data.managerId || undefined}
            >
              <SelectTrigger>
                <SelectValue placeholder="Meneceri seçin" />
              </SelectTrigger>
              <SelectContent>
                {users?.data.map((user: any) => {
                  return (
                    <SelectItem value={user.id} key={user.id}>
                      {user?.profile?.firstName + " " + user?.profile?.lastName}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div>
        <h2 className={"text-[24px] font-medium mt-8"}>Ətraflı</h2>
        <div className={"mt-5 grid grid-cols-2 gap-8"}>
          <div>
            <Label>Status</Label>
            <Select
              onValueChange={(value) =>
                setData((prevState) => ({
                  ...prevState,
                  status: value as CustomerStatus,
                }))
              }
              value={data.status}
            >
              <SelectTrigger>
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

        <div className={"mt-5 grid grid-cols-2 gap-8"}>
          {data.status === "ACTIVE" && (
            <>
              <div>
                <Label>Müqavilə tarixi</Label>
                <Input
                  value={data.contractDate}
                  onChange={(e) =>
                    setData((prevState) => ({
                      ...prevState,
                      contractDate: e.target.value,
                    }))
                  }
                  type={"date"}
                  placeholder={"Müqavilə tarixi"}
                />
              </div>{" "}
              <div>
                <Label>Aldığı xidmət</Label>
                <Input
                  value={data.service}
                  onChange={(e) =>
                    setData((prevState) => ({
                      ...prevState,
                      service: e.target.value,
                    }))
                  }
                  type={"text"}
                  placeholder={"Aldığı xidmət"}
                />
              </div>{" "}
              <div>
                <Label>Ödəniş </Label>
                <Input
                  value={data.paymentAmount || undefined}
                  onChange={(e) =>
                    setData((prevState) => ({
                      ...prevState,
                      paymentAmount: +e.target.value,
                    }))
                  }
                  type={"number"}
                  placeholder={"Ödəniş "}
                />
              </div>{" "}
              <div>
                <Label>Sahibkarın doğum günü </Label>
                <Input
                  value={data.ownersBirthday}
                  onChange={(e) =>
                    setData((prevState) => ({
                      ...prevState,
                      ownersBirthday: e.target.value,
                    }))
                  }
                  type={"date"}
                  placeholder={"Sahibkarın doğum günü "}
                />
              </div>
              <div>
                <Label>Şirkətin yaranma tarixi </Label>
                <Input
                  value={data.companyEstablishmentDate}
                  onChange={(e) =>
                    setData((prevState) => ({
                      ...prevState,
                      companyEstablishmentDate: e.target.value,
                    }))
                  }
                  type={"date"}
                  placeholder={"Şirkətin yaranma tarixi "}
                />
              </div>
              <div>
                <Label>Kurator</Label>
                <Input
                  value={data.curator}
                  onChange={(e) =>
                    setData((prevState) => ({
                      ...prevState,
                      curator: e.target.value,
                    }))
                  }
                  type={"text"}
                  placeholder={"Kurator "}
                />
              </div>
            </>
          )}

          {data.status === "LOST" && (
            <>
              <div>
                <Label>Müqavilə tarixi</Label>
                <Input
                  value={data.contractDate}
                  onChange={(e) =>
                    setData((prevState) => ({
                      ...prevState,
                      contractDate: e.target.value,
                    }))
                  }
                  type={"date"}
                  placeholder={"Müqavilə tarixi"}
                />
              </div>{" "}
              <div>
                <Label>Müqavilənin bitmə tarixi</Label>
                <Input
                  value={data.contractExpirationDate}
                  onChange={(e) =>
                    setData((prevState) => ({
                      ...prevState,
                      contractExpirationDate: e.target.value,
                    }))
                  }
                  type={"date"}
                  placeholder={"Müqavilənin bitmə tarixi"}
                />
              </div>{" "}
              <div>
                <Label>Aldığı xidmət</Label>
                <Input
                  value={data.service}
                  onChange={(e) =>
                    setData((prevState) => ({
                      ...prevState,
                      service: e.target.value,
                    }))
                  }
                  type={"text"}
                  placeholder={"Aldığı xidmət"}
                />
              </div>{" "}
              <div>
                <Label>Ödəniş şərtləri </Label>
                <Input
                  value={data.termsOfPayment}
                  onChange={(e) =>
                    setData((prevState) => ({
                      ...prevState,
                      termsOfPayment: e.target.value,
                    }))
                  }
                  type={"text"}
                  placeholder={"Ödəniş şərtləri "}
                />
              </div>{" "}
              <div>
                <Label>Xitam səbəbi</Label>
                <Textarea
                  value={data.terminationReason}
                  onChange={(e) =>
                    setData((prevState) => ({
                      ...prevState,
                      terminationReason: e.target.value,
                    }))
                  }
                  placeholder={"Xitam səbəbi "}
                />
              </div>
            </>
          )}
          {data.status === "POTENTIAL" && (
            <>
              <div>
                <Label>Mənbə</Label>
                <Input
                  value={data.source}
                  onChange={(e) =>
                    setData((prevState) => ({
                      ...prevState,
                      source: e.target.value,
                    }))
                  }
                  type={"text"}
                  placeholder={"Mənbə"}
                />
              </div>{" "}
              <div>
                <Label>Müraciət etdiyi xidmət</Label>
                <Input
                  value={data.service}
                  onChange={(e) =>
                    setData((prevState) => ({
                      ...prevState,
                      service: e.target.value,
                    }))
                  }
                  type={"text"}
                  placeholder={"Aldığı xidmət"}
                />
              </div>{" "}
              <div>
                <Label>Qeydlər</Label>
                <Textarea
                  value={data.notes}
                  onChange={(e) =>
                    setData((prevState) => ({
                      ...prevState,
                      notes: e.target.value,
                    }))
                  }
                  placeholder={"Qeydlər "}
                />
              </div>
            </>
          )}
        </div>
      </div>
      <Button className={"mt-8 float-right"} onClick={save}>
        Yadda saxla
      </Button>
    </div>
  );
}
