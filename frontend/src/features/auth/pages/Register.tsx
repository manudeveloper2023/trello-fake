  import { Button } from "@/components/ui/button";
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { Field, FieldGroup, FieldSet } from "@/components/ui/field";
  import { FormFieldInput } from "@/features/shared/components/FormFieldInput";
  import { registerSchema, type RegisterSchema } from "../schemas/RegisterSchema";
  import { zodResolver } from "@hookform/resolvers/zod"

  import { Controller, useForm } from "react-hook-form";
  import { toast } from "sonner";

  export const Register = () => {

    const {
      handleSubmit,
        control,
    }= useForm<RegisterSchema>({
      resolver: zodResolver(registerSchema),
      defaultValues: {
        username: "",
        email: "",
        password: "",
      }
    });

    const onSubmit = (data: RegisterSchema) => {
      toast.success("Form submitted successfully!");
      console.log(data);
    }

    return (
      <Card className="w-screen mx-auto p-6 xl:w-120 ">
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Please enter your email and password to create an account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid w-full items-center gap-6" onSubmit={handleSubmit(onSubmit)}>
            <FieldSet className="flex flex-col w-full">
              <FieldGroup>
                <Controller 
                  name="username"
                  control={control}
                  render={({ field, fieldState }) => (
                    <FormFieldInput
                      label="Username"
                      id="username"
                      placeholder="john_doe"
                      description="Must be at least 3 characters."
                      required
                      error={fieldState.error?.message}
                      {...field}
                    />
                  )}
                />
                <Controller
                  name="email"
                  control={control}
                  render={({ field, fieldState }) => (
                    <FormFieldInput
                  label="Email"
                  id="email"
                  placeholder="john.doe@gmail.com"
                  description="We'll never share your email with anyone else."
                  required
                  error={fieldState.error?.message}
                  {...field}
                  />
                  )}
                />
                <Controller
                  name="password"
                  control={control}
                  render={({ field, fieldState }) => (
                    <FormFieldInput
                      label="Password"
                      id="password"
                      type="password"
                      placeholder="********"
                      description="Must be at least 6 characters."
                      required
                      error={fieldState.error?.message}
                      {...field}
                    />
                  )}
                />
      
                
                <Field>
                  <Button type="submit" className="w-full h-10 cursor-pointer">
                    Register
                  </Button>
                </Field>
              </FieldGroup>
            </FieldSet>
          </form>
        </CardContent>
      </Card>
    );
  };
