import { useState } from 'react'
import { Text, Input, Stack, Button, Banner } from '@ds-pack/components'
import { Link, Layout, Header } from '../../../components'
// @TODO - enable update cache flow for server components
import { useData } from '../../../useData.client'
import type { Result } from '../../../types'
import { useRouter } from 'next/router'

function wrapAndClear(handlers, clearHandler) {
  return handlers.map((h) => (...args) => {
    clearHandler(null)
    h(...args)
  })
}

export default function Add({ username }) {
  let [name, setNameBase] = useState('')
  let [date, setDateBase] = useState('')
  let [err, setErr] = useState(null)
  let router = useRouter()
  let [result, updateCache] = useData<Result>(
    `${process.env.NEXT_PUBLIC_WORKER_BASE_URL}/?username=${username}`,
  )

  let [setName, setDate] = wrapAndClear([setNameBase, setDateBase], setErr)

  async function addDate() {
    if (!name) {
      setErr(`No 'name' edited!`)
      return
    }
    if (!date) {
      setErr(`No 'date' edited!`)
    }
    let res = await fetch(`${process.env.NEXT_PUBLIC_WORKER_BASE_URL}`, {
      method: 'POST',
      body: JSON.stringify({
        username: username,
        value: {
          ...result.data,
          dates: [
            ...result.data.dates,
            {
              name,
              date: date.toString(),
            },
          ],
        },
      }),
    })
    let response = (await res.json()) as Result
    if (response.success === false) {
      setErr(response.message)
      return
    }
    updateCache(
      `${process.env.NEXT_PUBLIC_WORKER_BASE_URL}/?username=${username}`,
      response,
    )
    router.push(`/user/${username}`)
  }
  return (
    <>
      <Header />
      <Layout pt="$4">
        <Stack gap="$4">
          <Input value={name} onChange={setName}>
            Name:
          </Input>
          <Input
            inputProps={{ type: 'datetime-local' }}
            value={date}
            onChange={setDate}
          >
            Date:
          </Input>
          <Button variant="primary" onClick={addDate}>
            Create
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

export async function getServerSideProps({ params: { username, passkey } }) {
  if (!passkey) {
    return {
      notFound: true,
    }
  }
  return {
    props: {
      username,
    },
  }
}
