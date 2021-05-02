import MainComponent from "../components/main";
import Head from 'next/head'

export default function App({ data }) {
  let title = `Today's Astronomy Picture of the Day`
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <meta name="twitter:title" content={title} />
        <meta property="og:image" content={data.url} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={data.url} />
      </Head>
      <MainComponent isToday={true} {...data} />
    </>
  );
}

export async function getStaticProps() {
  let data = await fetch(
    `https://api.nasa.gov/planetary/apod?api_key=${process.env.KEY}`
  ).then((r) => r.json());
  return { props: { data }, revalidate: 30 };
}
