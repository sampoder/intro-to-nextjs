import MainComponent from "../components/main";

export default function App() {
  return (
    <>
      <MainComponent
        title={"Clouds of the Carina Nebula"}
        copyright={"John Ebersole"}
        url={"https://apod.nasa.gov/apod/image/2105/EtaCore_Ebersole_960.jpg"}
        date={"2021-05-02"}
        isToday={true}
      />
    </>
  );
}
