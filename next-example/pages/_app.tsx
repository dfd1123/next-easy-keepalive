import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import {KeepAliveProvider} from 'next-easy-keepalive'

export default function App({ Component, pageProps }: AppProps) {
  return (
      <KeepAliveProvider>
        <Component {...pageProps} />
      </KeepAliveProvider>
  )
}
