import { Box, Heading } from '@ds-pack/components'
import { Link, Layout } from '../'

export default function Header({ second = null, ...props }) {
  return (
    <Box py="$2" backgroundColor="lavender" {...props}>
      <Layout display="flex" alignItems="center" justifyContent="space-between">
        <Heading is="h1" variant="h1">
          <Link href="/" style={{ textDecoration: 'none' }}>
            Time
          </Link>
        </Heading>
        {second}
      </Layout>
    </Box>
  )
}
