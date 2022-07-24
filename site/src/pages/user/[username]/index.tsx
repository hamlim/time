import { Box, Text, Heading, List, ListItem } from '@ds-pack/components'
import { Header, Layout, Link } from '../../../components'
import { useData } from '../../../useData.server'
import type { Result } from '../../../types'
import { format } from '../../../date-format'

function Card(props) {
  return <Box borderRadius="$small" backgroundColor="white" p="$2" {...props} />
}

export default function Name({ username }) {
  let result = useData<Result>(
    `${process.env.NEXT_PUBLIC_WORKER_BASE_URL}/?username=${username}`,
  )

  if (result.success === false) {
    throw new Error(result.message)
  }
  return (
    <>
      <Header second={<Link href={`/user/${username}/add`}>Add</Link>} />
      <Box pt="$4">
        <Layout>
          <Heading is="h2" variant="h3">
            Your Dates:
          </Heading>
          <Box
            display="grid"
            gap="8px"
            gridTemplateColumns={{
              _: '1fr',
              medium: '1fr 1fr',
              large: '1fr 1fr 1fr 1fr',
            }}
            p="$2"
          >
            {result.data.dates.map((d) => (
              <Card key={d.name}>
                <Heading is="h4" variant="h3">
                  <Link href={`/user/${username}/${d.name}`}>{d.name}</Link>
                </Heading>
                <List variant="base" is="ul">
                  <ListItem>
                    <Text style={{ textDecoration: 'underline' }}>
                      Original:
                    </Text>
                    <Text fontStyle="italic" is="time">
                      {format(new Date(d.date))}
                    </Text>
                  </ListItem>
                  <ListItem>
                    <Text style={{ textDecoration: 'underline' }}>Since:</Text>
                    <Text fontStyle="italic" is="time">
                      {format(new Date(d.date))}
                    </Text>
                  </ListItem>
                  <ListItem>
                    <Text style={{ textDecoration: 'underline' }}>Next:</Text>
                    <Text fontStyle="italic" is="time">
                      {format(new Date(d.date))}
                    </Text>
                  </ListItem>
                </List>
              </Card>
            ))}
          </Box>
        </Layout>
      </Box>
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
