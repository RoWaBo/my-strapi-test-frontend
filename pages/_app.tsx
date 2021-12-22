import '../styles/globals.css'
import type { AppContext, AppProps } from 'next/app'
import NavBar from '../components/NavBar'
import MainLayout from '../components/MainLayout'
import AppHead from '../components/AppHead'
import App from 'next/app'
import axios from 'axios'
import { getStrapiURL } from '../helperFunctions'
import qs from 'qs'

function MyApp({ Component, pageProps, navMenu }: AppProps) {
  console.log(navMenu);

  return (
    <>
      <AppHead />
      <NavBar menu={navMenu} />
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </>
  )
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext)

  // STRAPI AUTH
  const { data: auth } = await axios.post(getStrapiURL('/api/auth/local'), {
    identifier: process.env.AUTH_IDENTIFIER,
    password: process.env.AUTH_PASSWORD,
  });

  // STRAPI GET 
  const query = qs.stringify({
    fields: ['logo'],
    populate: 'Menu_item',
  }, {
    encodeValuesOnly: true,
  });

  const { data } = await axios.get(getStrapiURL(`/api/navigation-menu?${query}`), {
    headers: {
      Authorization:
        `Bearer ${auth.jwt}`,
    },
  })

  const navMenu = await data.data

  return { ...appProps, navMenu }
}

export default MyApp
