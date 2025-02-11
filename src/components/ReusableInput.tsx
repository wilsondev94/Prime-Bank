import { z } from "zod";
import { Control, FieldPath } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authFormSchema } from "@/lib/schamas";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const authSchema = authFormSchema("sign-up");

interface ReusableInputProps {
  control: Control<z.infer<typeof authSchema>>;
  name: FieldPath<z.infer<typeof authSchema>>;
  label: string;
  placeholder: string;
}

export default function ReusableInput({
  control,
  name,
  label,
  placeholder,
}: ReusableInputProps) {
  return (
    <div>
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <div className="form-item">
            <FormLabel className="form-label">{label}</FormLabel>
            <div className="flex w-full flex-col">
              <FormControl>
                <Input
                  {...field}
                  placeholder={placeholder}
                  type={name === "password" ? "password" : "text"}
                  className="input-class"
                />
              </FormControl>
            </div>
            <FormMessage className="form-message" />
          </div>
        )}
      />
    </div>
  );
}
