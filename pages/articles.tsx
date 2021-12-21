import axios from 'axios'
import { GetStaticProps } from 'next';
import { FunctionComponent } from 'react';

interface ArticlesProps {
    articles: any
}

const Articles: FunctionComponent<ArticlesProps> = ({ articles }) => {
    return (
        <>
            <h1>articles</h1>
            {console.log(articles)}
        </>
    );
}

export const getStaticProps: GetStaticProps = async () => {

    const { data: articles } = await axios.get(`http://${process.env.STRAPI_URL}/api/articles?populate=*`)

    return {
        props: {
            articles,
        },
        revalidate: 60,
    };
    // return {
    //   notFound: true,
    // };
};

export default Articles;