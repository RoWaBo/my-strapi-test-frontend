import axios from 'axios';
import type { GetStaticProps, NextPage } from 'next'
import Image from "next/image";
import qs from 'qs'
import { Article } from '../types/collectionTypes';

interface HomeProps {
  articles: Article[]
  strapiHost: string
}

const Home: NextPage<HomeProps> = ({ articles, strapiHost }) => {
  return (
    <>
      {console.log(articles)}
      {articles.map((article) => (
        <article key={article.id} className='mb-16'>
          <div>
            <h2 className='mb-4'>{article.attributes.title}</h2>
            <p>{article.attributes.description}</p>
          </div>
          {article.attributes.image?.data !== null && (
            <div className='mt-4'>
              <div className="relative w-full h-80 bg-gray-200 rounded-lg overflow-hidden">
                <Image
                  src={strapiHost + article.attributes.image?.data.attributes.url}
                  alt={article.attributes.image?.data.attributes.alternativeText}
                  layout="fill"
                  quality={70}
                  className="object-center object-cover"
                />
              </div>
            </div>
          )}
        </article>
      ))}
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {

  try {
    const strapiHost = process.env.STRAPI_HOST

    // STRAPI AUTH
    const { data: auth } = await axios.post(strapiHost + '/api/auth/local', {
      identifier: process.env.AUTH_IDENTIFIER,
      password: process.env.AUTH_PASSWORD,
    });
    if (auth.data === null) {
      throw { message: auth.error.message }
      return { notFound: true }
    }

    // STRAPI GET 
    const query = qs.stringify({
      fields: ['title', 'description'],
      populate: {
        image: {
          fields: ['alternativeText', 'url'],
        },
      },
    }, {
      encodeValuesOnly: true,
    });

    const { data } = await axios.get(`${strapiHost}/api/articles?${query}`)

    const articles = await data.data

    return {
      props: {
        articles,
        strapiHost
      },
      revalidate: 60,
    };
  } catch (err) {
    return {
      notFound: true
    }
  }
};

export default Home
