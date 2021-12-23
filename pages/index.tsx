import axios from 'axios';
import type { GetStaticProps, NextPage } from 'next'
import Image from "next/image";
import qs from 'qs'
import { getStrapiMedia, getStrapiURL } from '../helperFunctions';
import { Article } from '../types/collectionTypes';
import ReactMarkdown from 'react-markdown'

interface HomeProps {
  articles: Article[]
}

const Home: NextPage<HomeProps> = ({ articles }) => {

  const flexDirection = (value: number) => {
    const isEven = value % 2 === 0 ? true : false
    return isEven ? '' : 'flex-row-reverse';
  }

  return (
    <>
      {console.log(articles)}
      {articles.map((article, index) => (
        <article key={article.id} className={`mb-10 md:mb-20 md:flex gap-14 ${flexDirection(index)}`}>
          {/* TEXT SECTION */}
          <div className='flex-1'>
            <h2 className='mb-4'>{article.attributes.title}</h2>
            <ReactMarkdown className='react-markdown'>{article.attributes.description}</ReactMarkdown>
          </div>
          {/* IMAGE SECTION */}
          {article.attributes.image?.data !== null && (
            <div className='mt-6 md:mt-1 flex-1'>
              <div className="relative w-full h-80 md:h-full bg-gray-200 rounded-lg overflow-hidden shadow-lg">
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
