import axios from "axios";
import { useEffect, useState } from "react";
import { PainType } from "./utils/Types/PainType";
import { config } from "dotenv";
import Graph from "./Components/Graph";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { InterestingData } from "./Components/InterestingData";
import { InputData } from "./Components/InputData";
import NavBar from "./Components/NavBar";

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
      <>
        <Router>
          <NavBar />
          <Routes>
            {/* different pages */}
            <Route path="/" element={<Graph painData={painData} />} />
            <Route path="/data" element={<InterestingData />} />
            <Route path="/input-data" element={<InputData />} />
          </Routes>
        </Router>
      </>
    </>
  );
}

export default App;
