import axios from "axios";
import { useEffect, useState } from "react";
import { PainType } from "./utils/Types/PainType";
import { config } from "dotenv";

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
      {painData.length > 0 ? (
        painData.map((dataPoint) => (
          <div key={dataPoint.pain_id}>
            <p>time: {dataPoint.time}</p>
            <p>condition: {dataPoint.condition_name}</p>
            <p>description: {dataPoint.description}</p>
            <p>how bad was it: {dataPoint.description}</p>
          </div>
        ))
      ) : (
        <p>loading data</p>
      )}
    </>
  );
}

export default App;
