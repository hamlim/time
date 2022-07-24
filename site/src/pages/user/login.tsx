import { useState } from 'react'
import { Text, Input, Stack, Button, Banner } from '@ds-pack/components'
import { Link, Layout, Header } from '../../components'
import type { Result } from '../../types'
import { useRouter } from 'next/router'

function wrapAndClear(handlers, clearHandler) {
  return handlers.map((h) => (...args) => {
    clearHandler(null)
    h(...args)
  })
}

export default function Create() {
  let [username, setUsernameBase] = useState('')
  let [passkey, setPasskeyBase] = useState('')
  let [err, setErr] = useState(null)
  let router = useRouter()
  let [setUsername, setPasskey] = wrapAndClear(
    [setUsernameBase, setPasskeyBase],
    setErr,
  )

  async function login() {
    if (!username) {
      setErr(`No 'username' entered!`)
      return
    }
    if (!passkey) {
      setErr(`No 'passkey' entered!`)
      return
    }
    let res = await fetch(
      `${process.env.NEXT_PUBLIC_WORKER_BASE_URL}/check-user`,
      {
        method: 'POST',
        body: JSON.stringify({
          username,
          passkey,
        }),
      },
    )
    let response = (await res.json()) as Result
    if (response.success === false) {
      setErr(response.message)
      return
    }
    router.push(`/user/${username}?passkey=${passkey}`)
  }
  return (
    <>
      <Header />
      <Layout pt="$4">
        <Stack gap="$4">
          <Text>Create an account to get started!</Text>
          <Input value={username} onChange={setUsername}>
            Name:
          </Input>
          <Input value={passkey} onChange={setPasskey}>
            Passkey:
          </Input>
          <Button variant="primary" onClick={login}>
            Login
          </Button>
          {err ? (
            <Banner
              variant="error"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              {err}
            </Banner>
          ) : null}
        </Stack>
      </Layout>
    </>
  )
}

export async function getServerSideProps() {
  return {
    props: {},
  }
}
