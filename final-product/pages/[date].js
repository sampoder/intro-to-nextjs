import MainComponent from "../components/main";
import Error from "next/error";
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function App({ data, today, notFound }) {
  const router = useRouter()
  if (notFound) {
    return <Error statusCode={"404"} />;
  }
  if (router.isFallback) {
    return <div>Loading...</div>
  }
  if (today && typeof window != 'undefined'){
    router.replace('/')
  }
  let title = `${data.date}'s Astronomy Picture of the Day`
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta property="og:title" content={data.url} />
        <meta name="twitter:title" content={title} />
        <meta property="og:image" content={data.url} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={data.url} />
      </Head>
      <MainComponent isToday={today} {...data} />
    </>
  );
}

export async function getStaticPaths() {
  function getDateX(firstDate, daysBack) {
    let yesterday = new Date(firstDate);
    yesterday.setDate(yesterday.getDate() - daysBack);
    return yesterday.toISOString().split("T")[0];
  }
  let currentDate = (
    await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${process.env.KEY}`
    ).then((r) => r.json())
  ).date;
  return {
    paths: [...Array(180).keys()].map((x) => ({
      params: {
        date: getDateX(currentDate, x),
      },
    })),
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  try {
    let data = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${process.env.KEY}&date=${params.date}`
    ).then((r) => r.json());

    let currentDate = (
      await fetch(
        `https://api.nasa.gov/planetary/apod?api_key=${process.env.KEY}`
      ).then((r) => r.json())
    ).date;

    return {
      props: { data, today: currentDate == params.date ? true : false },
      revalidate: 30,
    };
  } catch {
    return { props: { notFound: true } };
  }
}
