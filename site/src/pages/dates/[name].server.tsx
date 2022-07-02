import { Box, Text, Heading } from '@ds-pack/components'
import Link from '../../components/Link'
import { useData } from '../../useData.server'

type Result =
  | {
      data: {
        dates: Array<{
          name: string
          date: string
        }>
      }
      success: true
    }
  | {
      message: string
      success: false
    }

export default function Name({ name }) {
  let result = useData<Result>(
    `${process.env.NEXT_PUBLIC_WORKER_BASE_URL}/?name=${name}`,
  )

  if (result.success === 'false') {
    throw new Error(result.message)
  }
  return (
    <Box>
      <Heading is="h1" variant="h1">
        Your Dates:
      </Heading>
      {result.data.dates.map((d) => (
        <Box key={d.name}>
          <Text fontStyle="bold">{d.name}</Text> -{' '}
          <Text is="time">{d.date}</Text>
        </Box>
      ))}
      <Box is="pre">{JSON.stringify(result.data, null, 2)}</Box>
      <Link href="/">Go Home</Link>
    </Box>
  )
}

export async function getServerSideProps({ params }) {
  return {
    props: {
      name: params.name,
    },
  }
}
