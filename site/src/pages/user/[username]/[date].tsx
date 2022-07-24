import { Box, Text, Heading, List, ListItem } from '@ds-pack/components'
import { Header, Layout, Link } from '../../../components'
import { useData } from '../../../useData.server'
import type { Result } from '../../../types'
import { format } from '../../../date-format'

export default function Name({ username, date }) {
  let result = useData<Result>(
    `${process.env.NEXT_PUBLIC_WORKER_BASE_URL}/?username=${username}`,
  )

  if (result.success === false) {
    throw new Error(result.message)
  }

  let data = result.data.dates.find((d) => d.name === date)

  console.log(data)

  return (
    <>
      <Header second={<Link href={`/user/${username}`}>All Dates</Link>} />
      <Box pt="$4">
        <Layout>
          <Heading is="h2" variant="h3">
            {date}:
          </Heading>
          <List variant="base" is="ul">
            <ListItem>
              <Text style={{ textDecoration: 'underline' }}>Original:</Text>
              <Text fontStyle="italic" is="time">
                {format(new Date(data.date))}
              </Text>
            </ListItem>
            <ListItem>
              <Text style={{ textDecoration: 'underline' }}>Since:</Text>
              <Text fontStyle="italic" is="time">
                {format(new Date(data.date))}
              </Text>
            </ListItem>
            <ListItem>
              <Text style={{ textDecoration: 'underline' }}>Next:</Text>
              <Text fontStyle="italic" is="time">
                {format(new Date(data.date))}
              </Text>
            </ListItem>
          </List>
        </Layout>
      </Box>
    </>
  )
}

export async function getServerSideProps({
  params: { username, passkey, date },
}) {
  if (!passkey) {
    return {
      notFound: true,
    }
  }
  return {
    props: {
      date,
      username,
    },
  }
}
