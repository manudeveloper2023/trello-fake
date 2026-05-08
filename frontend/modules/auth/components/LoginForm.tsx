"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import CustomInput from "@/modules/shared/components/Input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { formSchema, LoginFormValues } from "../schemas/login.schema"
import { login } from "../services/auth.service"
import { useState } from "react"
import { redirect } from "next/navigation"

export default function LoginForm() {
  const [isLoading, setLoading] = useState(false)
  const {
    control,
    handleSubmit,
    setError,
    formState: { isValid },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: LoginFormValues) => {
    const { password, email } = data
    try {
      setLoading(true)
      await login({ email, password })
    } catch (error) {
      setError("email", { message: "Invalid email or password" })
      setError("password", { message: "Invalid email or password" })
    } finally {
      setLoading(false)
      redirect("/dashboard")
    }
  }

  return (
    <div className="w-full max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Enter your credentials to access your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
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
            <Button
              type="submit"
              className={`mt-4 cursor-pointer ${!isValid ? "cursor-not-allowed opacity-50" : ""}`}
              disabled={isLoading || !isValid}
            >
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
