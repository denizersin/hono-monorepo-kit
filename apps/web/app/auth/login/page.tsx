"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { type TAuthValidator, authValidator } from "@repo/shared/validators"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useTRPC } from "@web/components/providers/trpc/trpc-provider"
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
import { useSession } from "@web/hooks/common"
import { cn } from "@web/lib/utils"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"




export default function Page() {

  const form = useForm<TAuthValidator.TLoginEmailAndPasswordFormSchema>({
    resolver: zodResolver(authValidator.loginEmailAndPasswordFormSchema)
  })


  const trpc = useTRPC()


  const queryClient = useQueryClient()

  const { mutate: login, isPending } = useMutation(trpc.auth.login.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.auth.getSession.queryFilter())
    }
  }))




  const onSubmit = ((data: TAuthValidator.TLoginEmailAndPasswordFormSchema) => {
    login(data)
  })


  const router = useRouter()
  const { isAuthenticated, isLoading, isError, session } = useSession()

  if (isAuthenticated || isLoading) return null

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className={cn("flex flex-col gap-6")}>
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
                  <Button type="submit" disabled={isPending}>
                    {isPending ? 'Logging in...' : 'Login'}
                  </Button>
                </form>
              </Form>

              <Button onClick={() => router.push('/auth/register')}>Register</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
