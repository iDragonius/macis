import React, { FC } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Services } from "@/lib/constants";
import { Input } from "@/components/ui/input";

interface SelectWithOtherOptionProps {
  options: any[];
  onValueChange(value: string): void;
  value: string | undefined;
  onOtherValueChange(value: string): void;
  otherValue: string;
  placeholder: string;
}

export const SelectWithOtherOption: FC<SelectWithOtherOptionProps> = ({
  options,
  onValueChange,
  value,
  onOtherValueChange,
  otherValue,
  placeholder,
}) => {
  return (
    <div>
      <Select
        onValueChange={(value) => {
          onOtherValueChange("");
          onValueChange(value);
        }}
        value={value}
      >
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {[...options, "Digər"].map((option) => (
            <SelectItem value={option} key={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {value === "Digər" && (
        <div className={"mt-2"}>
          <Input
            value={otherValue}
            onChange={(e) => onOtherValueChange(e.target.value)}
            placeholder={"Daxil edin"}
          />
        </div>
      )}
    </div>
  );
};
