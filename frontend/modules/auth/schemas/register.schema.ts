import * as z from "zod"

export const registerFormSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters long",
  }),
  username: z.string().min(3, {
    message: "Username must be at least 3 characters long",
  }),
})

export type RegisterFormValues = z.infer<typeof registerFormSchema>
