import { Box } from '@ds-pack/components'

export default function Layout(props) {
  return (
    <Box
      maxWidth={{
        _: '95vw',
        medium: '80vw',
        large: '70vw',
        extraLarge: '60vw',
      }}
      marginLeft="auto"
      marginRight="auto"
      {...props}
    />
  )
}
