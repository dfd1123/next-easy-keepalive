import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import {KeepAliveProvider} from 'next-easy-keepalive'
import {useRouter} from 'next/router';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
      <KeepAliveProvider router={router}>
        <Component {...pageProps} />
      </KeepAliveProvider>
  )
}
