"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { type TAuthValidator, authValidator } from "@repo/shared/validators"
import { CustomComboSelect } from "@web/components/custom-ui/custom-combo-select"
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
import { useRegisterMutation, useSession } from "@web/hooks/queries/auth"
import { useCountriesSelectData } from "@web/hooks/queries/predefıned"
import { cn } from "@web/lib/utils"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { OtpModal } from "../_components/otp-modal"




export default function Page() {
    const [isOtpModalOpen, setIsOtpModalOpen] = useState(false)
    const form = useForm<TAuthValidator.TRegisterFormSchema>({
        resolver: zodResolver(authValidator.registerFormSchema)
    })
    console.log('Register11')

    const {
        selectData: countriesSelectData,
        isLoading: isLoadingCountries,
    } = useCountriesSelectData()

    const { mutate: register, isPending } = useRegisterMutation({
        onSuccess: () => {
            setIsOtpModalOpen(true)
        }
    })

    const onSubmit = ((data: TAuthValidator.TRegisterFormSchema) => {
        register(data)
    })

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

                                    <div className="flex ">

                                        <FormField
                                            control={form.control}
                                            name="phoneCodeId"
                                            render={({ field }) => (
                                                <FormItem className="">
                                                    {/* <FormLabel>{t('phone_code')}</FormLabel> */}
                                                    <FormControl>
                                                        <CustomComboSelect
                                                            buttonClass="flex w-[80px] h-14 bg-gray-50 shadow-none placeholder:text-gray-500 rounded-tr-none rounded-br-none"
                                                            data={countriesSelectData}
                                                            onValueChange={(val) => field.onChange(Number(val))}
                                                            value={String(field.value)}
                                                            placeholder='code'
                                                            labelValueRender={(option) => option.label.split("-")[0] || option.label}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="phoneNumber"
                                            render={({ field }) => (
                                                <FormItem className="flex-1 w-full ">
                                                    {/* <FormLabel>{t('phone_number')}</FormLabel> */}
                                                    <FormControl>
                                                        <Input
                                                            className="h-14 bg-gray-50 shadow-none placeholder:text-gray-500 rounded-tl-none rounded-bl-none"
                                                            placeholder="Phone Number" {...field}
                                                            onChange={(e) => {
                                                                let value = e.target.value
                                                                value = value.replace(/\s/g, '')
                                                                if (value.length >= 3 && value?.[0] === "0") {
                                                                    value = value.slice(1)
                                                                }
                                                                field.onChange(value)
                                                                form.trigger('phoneNumber')
                                                            }}

                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

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


                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Name</FormLabel>
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
                                        name="surname"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Surname</FormLabel>
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


                                    <Button type="submit" disabled={isPending}>{
                                        isPending ? "Loading..." : "Submit"
                                    }</Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <OtpModal
                isOpen={isOtpModalOpen}
                setIsOpen={setIsOtpModalOpen}
                registerFormData={form.getValues()}
            />
        </div>
    )
}
