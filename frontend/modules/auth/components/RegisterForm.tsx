"use client"

import { useState } from "react"
import {
  registerFormSchema,
  RegisterFormValues,
} from "../schemas/register.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { register } from "../services/auth.service"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import CustomInput from "@/modules/shared/components/Input"
import { redirect } from "next/navigation"

export default function RegisterForm() {
  const [isLoading, setLoading] = useState(false)
  const {
    control,
    handleSubmit,
    setError,
    formState: { isValid, errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: "",
      password: "",
      username: "",
    },
  })

  const onSubmit = async (data: RegisterFormValues) => {
    setLoading(true)
    try {
      const { username, password, email } = data
      await register({ username, password, email })
    } catch (error) {
      setError("root.registrationError", {
        message: "Registration failed. Please try again.",
        type: "server",
      })
    } finally {
      setLoading(false)
      redirect("/dashboard")
    }
  }

  return (
    <div className="w-full max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>Create a new account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <CustomInput
              id="username"
              label="Username"
              type="text"
              description="Enter your desired username."
              control={control}
            />

            <CustomInput
              id="email"
              label="Email"
              type="email"
              description="We'll never share your email with anyone else."
              control={control}
            />

            <CustomInput
              id="password"
              label="Password"
              type="password"
              description="Make sure your password is at least 6 characters long."
              control={control}
            />
            {errors.root?.registrationError && (
              <p className="text-sm text-red-500">
                {errors.root.registrationError.message}
              </p>
            )}
            <Button
              type="submit"
              className={`mt-4 cursor-pointer ${!isValid ? "cursor-not-allowed bg-red-500 opacity-50" : ""}`}
              disabled={isLoading || !isValid}
            >
              Register
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
