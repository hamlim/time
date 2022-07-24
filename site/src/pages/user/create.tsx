import { useState } from 'react'
import {
  Text,
  Input,
  Stack,
  Button,
  Banner,
  InlineCode,
  Box,
} from '@ds-pack/components'
import { Link, Layout, Header } from '../../components'
import type { Result } from '../../types'
import { useRouter } from 'next/router'

function wrapAndClear(handlers, clearHandler) {
  return handlers.map((h) => (...args) => {
    clearHandler(null)
    h(...args)
  })
}

// Generated here: https://randomwordgenerator.com/weird-word.php
let words = [
  'hapax',
  'deric',
  'ancon',
  'longe',
  'lauds',
  'arval',
  'kvass',
  'round',
  'skink',
  'vinic',
  'phyle',
  'liard',
  'lazar',
  'dulia',
  'ankus',
  'lobar',
  'parse',
  'anear',
  'emmet',
  'synod',
  'dixit',
  'animé',
  'clepe',
  'gayal',
  'ishan',
]

function rand(max) {
  return Math.floor(Math.random() * max)
}

function generatePasskey() {
  let [first, second, third] = [
    words[rand(words.length)],
    words[rand(words.length)],
    words[rand(words.length)],
  ]
  return `${first}-${second}-${third}`
}

export default function Create({ passkey: startingKey }) {
  let [username, setUsernameBase] = useState('')
  let [err, setErr] = useState(null)
  let [passkey, baseReroll] = useState(startingKey)

  function reroll() {
    baseReroll(generatePasskey())
  }

  let router = useRouter()
  let [setUsername] = wrapAndClear([setUsernameBase], setErr)

  async function addUser() {
    if (!username) {
      setErr(`No 'username' entered!`)
      return
    }
    let res = await fetch(`${process.env.NEXT_PUBLIC_WORKER_BASE_URL}/create`, {
      method: 'POST',
      body: JSON.stringify({
        username: username,
      }),
    })
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
          <Box>
            Your passkey is <InlineCode>{passkey}</InlineCode>{' '}
            <Button variant="text" onClick={reroll}>
              Re-roll
            </Button>
          </Box>
          <Button variant="primary" onClick={addUser}>
            Let's Go!
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
  let passkey = generatePasskey()
  return {
    props: {
      passkey,
    },
  }
}
