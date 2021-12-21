import { FunctionComponent } from "react";
import Head from 'next/head'

const AppHead: FunctionComponent = () => {
    return (
        <Head>
            <title>Strapi Frotend Test Site</title>
            <meta name="description" content="Strapi frotend test site" />
            <link rel="icon" href="/strapi-logo.svg" />
        </Head>
    );
}

export default AppHead;