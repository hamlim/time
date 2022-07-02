import { vars } from '@ds-pack/components/src/vars.css'
import { globalStyle } from '@vanilla-extract/css'

globalStyle('html, body', {
  backgroundColor: vars.colors.yellow000,
})

globalStyle('body', {
  minHeight: '100vh',
})
