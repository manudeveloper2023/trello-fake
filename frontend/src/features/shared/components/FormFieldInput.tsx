import { type ComponentProps } from "react";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export interface FormFieldInputProps extends Omit<
  ComponentProps<typeof Input>,
  "id"
> {
  label: string;
  description?: string;
  error?: string;
  id: string;
}

export function FormFieldInput({
  label,
  description,
  error,
  id,
  ...inputProps
}: FormFieldInputProps) {
  return (
    <Field data-invalid={!!error}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>

      <Input id={id} aria-invalid={!!error} {...inputProps} />

      {description && !error && (
        <FieldDescription>{description}</FieldDescription>
      )}

      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
}
