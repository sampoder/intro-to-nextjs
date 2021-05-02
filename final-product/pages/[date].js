import MainComponent from "../components/main";

export default function App({ data, today }) {
  return (
    <>
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
    fallback: true
  };
}

export async function getStaticProps({ params }) {

  let data = await fetch(
    `https://api.nasa.gov/planetary/apod?api_key=${process.env.KEY}&date=${params.date}`
  ).then((r) => r.json());

  let currentDate = (
    await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${process.env.KEY}`
    ).then((r) => r.json())
  ).date;

  return { props: { data, today: currentDate == params.date ? true : false }, revalidate: 30 };
}