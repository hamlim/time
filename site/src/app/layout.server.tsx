import { themeClass } from '@ds-pack/components'
import '@ds-pack/components/src/reset.css'
import '../global.css'

export default function Layout({ children }) {
  return (
    <html className={themeClass}>
      <head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <title>Time from APP</title>
      </head>
      <body>{children}</body>
    </html>
  )
}
