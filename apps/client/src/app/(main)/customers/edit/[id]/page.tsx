"use client";
import { useQuery } from "@tanstack/react-query";
import { CustomerApi } from "@/lib/api/customer.api";
import { useEffect, useState } from "react";
import { UserApi } from "@/lib/api/user.api";
import { CustomerDto } from "@/lib/types";
import { useRouter } from "next/navigation";
import { PageTitle } from "@/components/ui/page-title";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CustomerStatus, formatInputDate } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { Positions, Services, Sources } from "@/lib/constants";
import { SelectWithOtherOption } from "@/components/ui/select-with-other-option";

export default function Page({ params }: { params: { id: string } }) {
  const { data: customer, refetch } = useQuery({
    queryKey: ["customer", params.id],
    queryFn: () => CustomerApi.getCustomer(params.id),
  });
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
    paymentInformation: "",
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
    otherPosition: "",
    otherService: "",
    otherSource: "",
  });
  const { push } = useRouter();

  useEffect(() => {
    if (customer) {
      setData({
        managerId: customer?.data?.manager?.id || null,
        status: customer.data.status,
        company: customer.data.company || "",
        curator: customer.data.curator || "",
        contactNumber: customer.data.contactNumber || "",
        contractExpirationDate: formatInputDate(
          customer.data.contractExpirationDate || "",
        ),
        contractDate: formatInputDate(customer.data.contractDate || ""),
        companyEstablishmentDate: formatInputDate(
          customer.data.companyEstablishmentDate || "",
        ),
        service: Services.includes(customer?.data?.service || "")
          ? customer?.data?.service || ""
          : "Digər",
        paymentAmount: customer.data.paymentAmount || 0,
        source: Sources.includes(customer?.data?.source || "")
          ? customer?.data?.source || ""
          : "Digər",
        head: customer.data.head || "",
        terminationReason: customer.data.terminationReason || "",
        termsOfPayment: customer.data.termsOfPayment || "",
        ownersBirthday: formatInputDate(customer.data.ownersBirthday || ""),
        notes: customer.data.notes || "",
        position: Positions.includes(customer?.data?.position || "")
          ? customer?.data?.position || ""
          : "Digər",
        otherService: Services.includes(customer?.data?.service || "")
          ? ""
          : customer?.data?.service || "",
        otherPosition: Positions.includes(customer?.data?.position || "")
          ? ""
          : customer?.data?.position || "",
        otherSource: Sources.includes(customer?.data?.source || "")
          ? ""
          : customer?.data?.source || "",
        paymentInformation: customer?.data?.paymentInformation || "",
      });
    }
  }, [customer]);

  function save() {
    if (data.status === "ACTIVE") {
      CustomerApi.updateCustomer(params.id, {
        company: data.company,
        head: data.head,
        position:
          data.position === "Digər" ? data.otherPosition : data.position,
        contactNumber: data.contactNumber,
        status: data.status,
        contractDate: data.contractDate,
        service: data.service === "Digər" ? data.otherService : data.service,
        paymentAmount: +data.paymentAmount,
        paymentInformation: data.paymentInformation,
        ownersBirthday: data.ownersBirthday,
        companyEstablishmentDate: data.companyEstablishmentDate,
        curator: data.curator,
        managerId: data.managerId,
      }).then((res) => {
        toast.success("Müştəri məlumatları uğurla dəyişdirildi!");
        push("/active-customers");
      });
    } else if (data.status === "LOST") {
      CustomerApi.updateCustomer(params.id, {
        company: data.company,
        head: data.head,
        position:
          data.position === "Digər" ? data.otherPosition : data.position,
        contactNumber: data.contactNumber,
        status: data.status,
        curator: data.curator,
        contractDate: data.contractDate,
        contractExpirationDate: data.contractExpirationDate,
        termsOfPayment: data.termsOfPayment,
        terminationReason: data.terminationReason,
        service: data.service === "Digər" ? data.otherService : data.service,
        managerId: data.managerId,
      }).then((res) => {
        toast.success("Müştəri məlumatları uğurla dəyişdirildi!");
        push("/lost-customers");
      });
    } else {
      CustomerApi.updateCustomer(params.id, {
        company: data.company,
        head: data.head,
        contactNumber: data.contactNumber,
        status: data.status,
        position:
          data.position === "Digər" ? data.otherPosition : data.position,
        source: data.source === "Digər" ? data.otherSource : data.source,
        notes: data.notes,
        service: data.service === "Digər" ? data.otherService : data.service,
        managerId: data.managerId,
      }).then((res) => {
        toast.success("Müştəri məlumatları uğurla dəyişdirildi!");
        push("/potential-customers");
      });
    }
  }

  return (
    <div>
      <PageTitle>Müştəri məlumatlarını dəyiş</PageTitle>
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
            <Label>Əlaqədar Şəxs</Label>
            <Input
              value={data.head}
              onChange={(e) =>
                setData((prevState) => ({
                  ...prevState,
                  head: e.target.value,
                }))
              }
              type={"text"}
              placeholder={"Əlaqədar Şəxs"}
            />
          </div>
          <div>
            <Label>Vəzifə</Label>

            <SelectWithOtherOption
              onValueChange={(value) => {
                setData((prevState) => ({
                  ...prevState,
                  position: value,
                }));
              }}
              value={data.position || undefined}
              otherValue={data.otherPosition}
              onOtherValueChange={(value) =>
                setData((prevState) => ({
                  ...prevState,
                  otherPosition: value,
                }))
              }
              placeholder={"Vəzifə"}
              options={Positions}
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
                <SelectWithOtherOption
                  onValueChange={(value) => {
                    setData((prevState) => ({
                      ...prevState,
                      service: value as string,
                    }));
                  }}
                  value={data.service || undefined}
                  otherValue={data.otherService}
                  onOtherValueChange={(value) =>
                    setData((prevState) => ({
                      ...prevState,
                      otherService: value as string,
                    }))
                  }
                  placeholder={"Aldığı xidmət"}
                  options={Services}
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
                <Label>Ödəniş məlumatları </Label>
                <Input
                  value={data.paymentInformation}
                  onChange={(e) =>
                    setData((prevState) => ({
                      ...prevState,
                      paymentInformation: e.target.value,
                    }))
                  }
                  type={"text"}
                  placeholder={"Ödəniş məlumatları"}
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
                <SelectWithOtherOption
                  onValueChange={(value) => {
                    setData((prevState) => ({
                      ...prevState,
                      service: value as string,
                    }));
                  }}
                  value={data.service || undefined}
                  otherValue={data.otherService}
                  onOtherValueChange={(value) =>
                    setData((prevState) => ({
                      ...prevState,
                      otherService: value as string,
                    }))
                  }
                  placeholder={"Aldığı xidmət"}
                  options={Services}
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
                <SelectWithOtherOption
                  onValueChange={(value) => {
                    setData((prevState) => ({
                      ...prevState,
                      source: value as string,
                    }));
                  }}
                  value={data.source || undefined}
                  otherValue={data.otherSource}
                  onOtherValueChange={(value) =>
                    setData((prevState) => ({
                      ...prevState,
                      otherSource: value as string,
                    }))
                  }
                  placeholder={"Mənbə"}
                  options={Sources}
                />{" "}
              </div>{" "}
              <div>
                <Label>Müraciət etdiyi xidmət</Label>
                <SelectWithOtherOption
                  onValueChange={(value) => {
                    setData((prevState) => ({
                      ...prevState,
                      service: value as string,
                    }));
                  }}
                  value={data.service || undefined}
                  otherValue={data.otherService}
                  onOtherValueChange={(value) =>
                    setData((prevState) => ({
                      ...prevState,
                      otherService: value as string,
                    }))
                  }
                  placeholder={"Aldığı xidmət"}
                  options={Services}
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
