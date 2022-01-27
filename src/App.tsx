import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { PainType } from "./utils/Types/PainType";
import { UserType } from "./utils/Types/UserType";
import { ConditionsType } from "./utils/Types/ConditionsType";
import { config } from "dotenv";
import Graph from "./Components/Graph";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import InterestingData from "./Components/InterestingData";
import { InputData } from "./Components/InputData";
import NavBar from "./Components/NavBar";
import "./App.css";
import { PainkillerType } from "./utils/Types/PainkillerType";
import { UserConditionsType } from "./utils/Types/UserConditionType";

config();

const apiBaseURL = process.env.REACT_APP_API_BASE;

function App(): JSX.Element {
  const [painData, setPainData] = useState<PainType[]>([]);
  const [painkillerData, setPainkillerData] = useState<PainkillerType[]>([]);
  const [conditionsData, setConditionsData] = useState<ConditionsType[]>([]);
  const [signedInUser, setSignedUser] = useState<UserType>({
    username: "guest",
    user_id: 1,
    condition_id: 1,
  });
  const [signedInUserConditions, setSignedUserConditions] = useState<
    UserConditionsType[]
  >([]);

  const getAllData = useCallback(async () => {
    const painResponse = await axios.get(`${apiBaseURL}pain`);
    setPainData(painResponse.data.data);
    const painkillerResponse = await axios.get(`${apiBaseURL}painkillers`);
    setPainkillerData(painkillerResponse.data.data);
    const conditionsResponse = await axios.get(`${apiBaseURL}conditions`);
    setConditionsData(conditionsResponse.data.data);
    const signedInUserResponse = await axios.get(
      `${apiBaseURL}user/${signedInUser.user_id}`
    );
    setSignedUserConditions(signedInUserResponse.data.data);
    setSignedUser({
      username: "guest",
      user_id: 1,
      condition_id: 1,
    });
  }, [
    setConditionsData,
    setPainkillerData,
    setPainData,
    setSignedUserConditions,
    signedInUser.user_id,
    setSignedUser,
  ]);

  useEffect(() => {
    console.log("getPainData called");
    getAllData();
  }, [getAllData]);

  return (
    <>
      <>
        <Router>
          <NavBar />
          <Routes>
            {/* different pages */}
            <Route
              path="/"
              element={
                <Graph
                  signedInUserConditions={signedInUserConditions}
                  painData={painData}
                />
              }
            />
            <Route path="/data" element={<InterestingData />} />
            <Route
              path="/input-data"
              element={
                <InputData
                  painkillerData={painkillerData}
                  conditionsData={conditionsData}
                  setPainkillerData={setPainkillerData}
                  setConditionsData={setConditionsData}
                />
              }
            />
          </Routes>
        </Router>
      </>
    </>
  );
}

export default App;
