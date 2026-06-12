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

export const Register = () => {
  return (
    <Card className="w-screen mx-auto p-6 xl:w-120 ">
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Please enter your email and password to create an account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid w-full items-center gap-6">
          <FieldSet className="flex flex-col w-full">
            <FieldGroup>
              <FormFieldInput
                label="Username"
                id="username"
                placeholder="John Doe"
                description="Must be at least 3 characters."
                required
              />
              <FormFieldInput
                label="Email"
                id="email"
                placeholder="john.doe@gmail.com"
                description="We'll never share your email with anyone else."
                required
              />
              <FormFieldInput
                label="Password"
                id="password"
                type="password"
                placeholder="********"
                description="Must be at least 6 characters."
                required
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
