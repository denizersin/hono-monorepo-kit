"use client"
import Image, { type ImageProps } from "next/image";
// import { hc, InferResponseType } from 'hono/client'
import { useEffect } from "react";

// apps/web/app/(app)/page.tsx
// apps/web/app/globals.css
import { useTRPC } from "@/components/providers/trpc/trpc-provider";
import { useSession } from "@/hooks/common";
import { QUERY_KEYS } from "@/hooks/rest-queries";
import { useLogoutMutation } from "@/hooks/rest-queries/auth";
import { userQueryOptions } from "@/hooks/rest-queries/user";
import { clientWithType } from "@/lib/api-client";
import { isErrorResponse } from "@/lib/utils";
import { SahredEnums } from "@repo/shared/enums";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// userValidator.userBaseInsertSchema.parse({
//   email:"asd",
//   password:"asd",
//   name:"asd",
// })

// const client = hc<AppType>('http://localhost:3002')


// type THealthResponse = InferResponseType<typeof client.api.health.$get>





type Props = Omit<ImageProps, "src"> & {
  srcLight: string;
  srcDark: string;
};

const ThemeImage = (props: Props) => {
  const { srcLight, srcDark, ...rest } = props;

  return (
    <>
      <Image {...rest} src={srcLight} className="imgLight" />
      <Image {...rest} src={srcDark} className="imgDark" />
    </>
  );
};



export default function Home() {
  console.log(SahredEnums.MailConfirmationStatus)

  const trpc = useTRPC()

  const query2 = useQuery(trpc.auth.getSession.queryOptions())

  console.log(query2.data, 'query2')




  useEffect(() => {

    // const websocket = clientWithType.websocket["panel-events"].$ws()

    // websocket.addEventListener('open', () => {
    //   console.log('WebSocket opened')
    // })

    // websocket.addEventListener('message', (event) => {
    //   console.log('WebSocket message', event)
    // })

    // websocket.addEventListener('error', (event) => {
    //   console.log('WebSocket error', event)
    // })

    // clientWithType.index.$get().then(r => r.json()).then(data => {
    //   if (data.message) {
    //     console.log(data.message)
    //   }
    // })

    // console.log(clientWithType.user["with-id"][":id"].$url())

    // console.log(clientWithType.user.me.$url())

    // clientWithType.user.me.$get().then(r => {
    //   r.json().then(data => {
    //     console.log(data)
    //   })
    // })

    // clientWithType.user["test-handles"].$get().then(r => {
    //   r.json().then(data => {
    //     console.log(data)
    //   })
    // })

    // clientWithType.auth.login.$post({
    //   json: {
    //     email: "asd",
    //     password: "asd",

    //   }
    // }).then(r => {
    //   r.json().then(data => {
    //     console.log(data)
    //     if (data.success) {
    //     }
    //   })
    // })

    // clientWithType.user["with-id"][":id"].$get({
    //   param: {
    //     id: '2'
    //   }
    // }).then(r => {
    //   r.json().then(data => {
    //     console.log(data)
    //   })
    // })



    const user = {
      email: "asd",
      password: "asd",
      name: "asd",

    }

    try {
      // userValidator.userInsertSchema.parse(user)
    } catch (error) {
      console.log(error)
    }




  }, [])

  const { data, error, isLoading } = useQuery({
    ...userQueryOptions,
    enabled: false
  })

  const { session } = useSession()

  console.log(session)

  const { mutate: logout, isPending: isLogoutPending } = useLogoutMutation()

  const { data: userMe } = useQuery({
    queryKey: [QUERY_KEYS.USER_ME],
    queryFn: () => {
      return clientWithType.user.me.$get().then(r => r.json())
    }
  })

  console.log(userMe, 'userMe')

  useEffect(() => {
    if (!error) return
    console.log('has error')
    if (error && isErrorResponse(error)) {
      console.log(error)

    }
  }, [error])




  return (
    <div>
      home

      <Button
        onClick={() => {
          logout()
        }}
      >
        Logout
      </Button>

      <Link href="/auth/login">
        <Button>
          Login
        </Button>
      </Link>

      <Link href="/auth/register">
        Login
      </Link>
    </div>
  );
}
