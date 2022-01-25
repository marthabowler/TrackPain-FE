import axios from "axios";
import { useEffect, useState } from "react";
import { PainType } from "./utils/Types/PainType";
// import { PainkillerType } from "./utils/Types/PainkillerType";
import { config } from "dotenv";
import Graph from "./Components/Graph";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { InterestingData } from "./Components/InterestingData";
import { InputData } from "./Components/InputData";
import NavBar from "./Components/NavBar";
import "./App.css";

config();

const apiBaseURL = process.env.REACT_APP_API_BASE;

function App(): JSX.Element {
  const [painData, setPainData] = useState<PainType[]>([]);
  // const [painkillerData, setPainkillerData] = useState<PainkillerType[]>([]);
  // const [conditionsData, setConditionsData] = useState<PainkillerType[]>([]);

  async function getAllData() {
    const painResponse = await axios.get(`${apiBaseURL}pain`);
    setPainData(painResponse.data.data);
    // const painkillerResponse = await axios.get(`${apiBaseURL}painkillers`);
    // setPainkillerData(painkillerResponse.data.data);
    // const conditionsResponse = await axios.get(`${apiBaseURL}conditions`);
    // setConditionsData(conditionsResponse.data.data);
  }

  useEffect(() => {
    console.log("getPainData called");
    getAllData();
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
