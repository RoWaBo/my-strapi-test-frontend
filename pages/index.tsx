import axios from 'axios';
import type { GetStaticProps, NextPage } from 'next'
import Image from "next/image";
import qs from 'qs'
import { getStrapiMedia, getStrapiURL } from '../helperFunctions';
import { Article } from '../types/collectionTypes';

interface HomeProps {
  articles: Article[]
}

const Home: NextPage<HomeProps> = ({ articles }) => {
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
                {article.attributes.image?.data.attributes.url !== undefined && (
                  <Image
                    src={getStrapiMedia(article.attributes.image?.data.attributes.url)}
                    alt={article.attributes.image?.data.attributes.alternativeText}
                    layout="fill"
                    quality={70}
                    className="object-center object-cover"
                  />
                )}
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
    // STRAPI AUTH
    const { data: auth } = await axios.post(getStrapiURL('/api/auth/local'), {
      identifier: process.env.AUTH_IDENTIFIER,
      password: process.env.AUTH_PASSWORD,
    });

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

    const { data } = await axios.get(getStrapiURL(`/api/articles?${query}`), {
      headers: {
        Authorization:
          `Bearer ${auth.jwt}`,
      },
    })

    const articles = await data.data

    return {
      props: {
        articles
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
