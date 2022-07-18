import { Box, Text } from '@ds-pack/components'
import Link from '../components/Link'

export default function Landing() {
  return (
    <Box>
      <Text>More coming soon!</Text>
      <Link href="/dates/test-1">Go to test-1</Link>
    </Box>
  )
}

export async function getServerSideProps() {
  return {
    props: {},
  }
}
