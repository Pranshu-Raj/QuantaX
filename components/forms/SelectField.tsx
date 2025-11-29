import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Select } from "@radix-ui/react-select";
import React from "react";
import { Controller } from "react-hook-form";

const SelectField = ({
  name,
  label,
  placeholder,
  options,
  control,
  error,
  required = false,
}: SelectFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="form-label">
        {label}
      </Label>

      <Controller
        name={name}
        control={control}
        rules={{
          required: required
            ? `Please select ${label.toLowerCase} is required`
            : false,
        }}
        render={({ field }) => (
          <Select>
            <SelectTrigger className="w-[180ppx]">
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{label}</SelectLabel>
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
      />
    </div>
  );
};

export default SelectField;
