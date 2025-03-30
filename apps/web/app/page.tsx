"use client"
import Image, { type ImageProps } from "next/image";
import styles from "./page.module.css";
// import { hc, InferResponseType } from 'hono/client'
import { useEffect } from "react";

import { SahredEnums } from "@repo/shared/enums";
import { clientWithType } from "@web/lib/api-client";
import { userQueryOptions, useUserMeQuery } from "@web/hooks/queries/user";
import { isErrorResponse } from "@web/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useLogoutMutation } from "@web/hooks/queries/auth";

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
  useEffect(() => {

    const websocket = clientWithType.websocket["panel-events"].$ws()

    websocket.addEventListener('open', () => {
      console.log('WebSocket opened')
    })

    websocket.addEventListener('message', (event) => {
      console.log('WebSocket message', event)
    })

    websocket.addEventListener('error', (event) => {
      console.log('WebSocket error', event)
    })

    clientWithType.index.$get().then(r => r.json()).then(data => {
      if (data.message) {
        console.log(data.message)
      }
    })

    console.log(clientWithType.user["with-id"][":id"].$url())

    console.log(clientWithType.user.me.$url())

    clientWithType.user.me.$get().then(r => {
      r.json().then(data => {
        console.log(data)
      })
    })


    clientWithType.auth.login.$post({
      json: {
        email: "asd",
        password: "asd",

      }
    }).then(r => {
      r.json().then(data => {
        console.log(data)
        if (data.success) {
        }
      })
    })

    clientWithType.user["with-id"][":id"].$get({
      param: {
        id: '2'
      }
    }).then(r => {
      r.json().then(data => {
        console.log(data)
      })
    })



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

  const { mutate: logout, isPending: isLogoutPending } = useLogoutMutation()

  useEffect(() => {
    if (!error) return
    console.log('has error')
    if (error && isErrorResponse(error)) {
      console.log(error)

    }
  }, [error])

  console.log(data, error, isLoading)

  console.log(error, 'error2323')


  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <ThemeImage
          className={styles.logo}
          srcLight="turborepo-dark.svg"
          srcDark="turborepo-light.svg"
          alt="Turborepo logo"
          width={180}
          height={38}
          priority
        />
        <ol>
          <li className="text-red-500">
            Get started by editing <code>apps/web/app/page.tsx</code>
          </li>
          <li>Save and see your changes instantly2232zx.</li>
        </ol>

        <div className={styles.ctas}>
          <a
            className={styles.primary}
            href="https://vercel.com/new/clone?demo-description=Learn+to+implement+a+monorepo+with+a+two+Next.js+sites+that+has+installed+three+local+packages.&demo-image=%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F4K8ZISWAzJ8X1504ca0zmC%2F0b21a1c6246add355e55816278ef54bc%2FBasic.png&demo-title=Monorepo+with+Turborepo&demo-url=https%3A%2F%2Fexamples-basic-web.vercel.sh%2F&from=templates&project-name=Monorepo+with+Turborepo&repository-name=monorepo-turborepo&repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fturborepo%2Ftree%2Fmain%2Fexamples%2Fbasic&root-directory=apps%2Fdocs&skippable-integrations=1&teamSlug=vercel&utm_source=create-turbo"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className={styles.logo}
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now23
          </a>
          <a
            href="https://turbo.build/repo/docs?utm_source"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.secondary}
          >
            Read our docs
          </a>
        </div>
        <button className={styles.secondary}>
          Open alert
        </button>
        <button className={styles.secondary} onClick={() => {
          logout()
        }}>
          {isLogoutPending ? 'Logging out...' : 'Logout'}
        </button>
      </main>
      <footer className={styles.footer}>
        <a
          href="https://vercel.com/templates?search=turborepo&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          href="https://turbo.build?utm_source=create-turbo"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to turbo.build →
        </a>
      </footer>
    </div>
  );
}
