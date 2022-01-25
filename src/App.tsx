import axios from "axios";
import { useEffect, useState } from "react";
import { PainType } from "./utils/Types/PainType";
import { config } from "dotenv";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

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

  const chartData = {
    labels: painData.map((dataPoint: { time: string }) => dataPoint.time),
    datasets: [
      {
        label: "Pain seriousness",
        data: painData.map(
          (dataPoint: { seriousness: number }) => dataPoint.seriousness
        ),
        fill: true,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
      },
    ],
  };

  return <>{chartData ? <Line data={chartData} /> : <p>Data Loading</p>}</>;
}

export default App;
