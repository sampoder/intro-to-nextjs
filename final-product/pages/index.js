import MainComponent from "../components/main";

export default function App({ data }) {
  return (
    <>
      <MainComponent
        isToday={true}
        {...data}
      />
    </>
  );
}

export async function getStaticProps() {
  let data = await fetch(
    `https://api.nasa.gov/planetary/apod?api_key=${process.env.KEY}`
  ).then((r) => r.json());
  return { props: { data }, revalidate: 30 };
}