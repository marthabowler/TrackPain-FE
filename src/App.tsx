import axios from "axios";
import { useEffect, useState } from "react";
import { PainType } from "./utils/Types/PainType";
import { config } from "dotenv";
import Graph from "./Components/Graph";

config();

const apiBaseURL = process.env.REACT_APP_API_BASE;

function App(): JSX.Element {
  const [painData, setPainData] = useState<PainType[]>([]);

  async function getPainData() {
    const painResponse = await axios.get(`${apiBaseURL}pain`);
    setPainData(painResponse.data.data);
  }

  useEffect(() => {
    console.log("getPainData called");
    getPainData();
  }, []);

  return (
    <>
      <Graph painData={painData} />
    </>
  );
}

export default App;
