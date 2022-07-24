import { Text } from '@ds-pack/components'
import { Link, Layout, Header } from '../components'

export default function Landing() {
  return (
    <>
      <Header />
      <Layout pt="$4">
        <Text>Save and remember dates on the go!</Text>
        <Link href="/user/create">Create an account to get started!</Link>
      </Layout>
    </>
  )
}

export async function getServerSideProps() {
  return {
    props: {},
  }
}
