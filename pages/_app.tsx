import '../styles/globals.css'
import type { AppProps } from 'next/app'
import NavBar from '../components/NavBar'
import MainLayout from '../components/MainLayout'
import AppHead from '../components/AppHead'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <AppHead />
      <NavBar />
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </>
  )
}

export default MyApp
