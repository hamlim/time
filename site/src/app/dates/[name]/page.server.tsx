import { Box, Text } from '@ds-pack/components'
import Link from '../../../components/Link'

export default function Name({ name }) {
  return (
    <Box>
      <Text>APP: On {name} page!</Text>
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
