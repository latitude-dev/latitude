import React from 'react'
import { render } from 'ink'
import App, { AppProps } from './app.js'
import Fullscreen from './components/Fullscreen.js'

export default function main(props: AppProps) {
  render(
    <Fullscreen>
      <App {...props} />
    </Fullscreen>,
  )
}
