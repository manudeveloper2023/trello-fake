import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { fields } from "@hookform/resolvers/ajv/src/__tests__/__fixtures__/data.js"
import { Control, Controller } from "react-hook-form"

export interface InputProps {
  id: string
  placeholder?: string
  required?: boolean
  label?: string
  type?: string
  description?: string
  invalid?: boolean
  control: any
}
export default function CustomInput({
  id,
  placeholder,
  required,
  type,
  label,
  control,
  description,
}: InputProps) {
  return (
    <Controller
      name={id}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}
          <Input
            aria-invalid={fieldState.invalid}
            id={id}
            placeholder={placeholder}
            required={required}
            type={type}
            {...field}
          />

          {!fieldState.error && description && (
            <FieldDescription>{description}</FieldDescription>
          )}

          {fieldState.error && (
            <FieldError>{fieldState.error.message}</FieldError>
          )}
        </Field>
      )}
    ></Controller>
  )
}
