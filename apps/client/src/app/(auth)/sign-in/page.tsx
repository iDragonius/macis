import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function SignIn() {
  return (
    <div className={"w-full h-full flex items-center justify-center"}>
      <div className={"w-[600px]"}>
        <h1 className={"text-blue-600 text-[40px] font-semibold text-center"}>
          Daxil ol
        </h1>
        <form className={"flex flex-col gap-2"}>
          <div>
            <Label>E-mail</Label>
            <Input
              type={"tel"}
              placeholder={"example@gmail.com"}
              className={"w-full"}
            />
          </div>
          <div>
            <Label>Şifrə</Label>
            <Input
              type={"password"}
              placeholder={"Şifrənizi daxil edin"}
              className={"w-full"}
            />
          </div>
          <Button className={"mt-3"}>Daxil ol</Button>
        </form>
      </div>
    </div>
  );
}
