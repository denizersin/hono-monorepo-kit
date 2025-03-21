"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { TAuthValidator, authValidator } from "@repo/shared/validators"
import { Button } from "@web/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@web/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@web/components/ui/form"
import { Input } from "@web/components/ui/input"
import { cn } from "@web/lib/utils"
import { useForm } from "react-hook-form"
export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const form = useForm<TAuthValidator.TLoginEmailAndPasswordFormSchema>({
    resolver: zodResolver(authValidator.loginEmailAndPasswordFormSchema)
  })

  const onSubmit = ((data: TAuthValidator.TLoginEmailAndPasswordFormSchema) => {
    console.log(data)
  })

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account223
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="shadcn" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="shadcn" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
