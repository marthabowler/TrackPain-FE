import { PainType } from "../utils/Types/PainType";
import { Bar, Line } from "react-chartjs-2";
import moment from "moment";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  BarElement,
  Tooltip,
  Legend
);

interface GraphProps {
  painData: PainType[];
}

export default function Graph(props: GraphProps): JSX.Element {
  const chartData = {
    labels: props.painData.map((dataPoint: { time: string }) =>
      moment(dataPoint.time).format("MMMM Do YYYY, h:mm:ss a")
    ),
    datasets: [
      {
        label: "pain level",
        data: props.painData.map(
          (dataPoint: { seriousness: number }) => dataPoint.seriousness
        ),
        backgroundColor: "#FF0080",
        borderColor: "#FF8C00",
      },
    ],
  };

  const painKillerData = {
    labels: props.painData.map(
      (dataPoint: { painkiller_name: string }) => dataPoint.painkiller_name
    ),
    datasets: [
      {
        label: "pain level",
        data: props.painData.map(
          (dataPoint: { seriousness: number }) => dataPoint.seriousness
        ),
        backgroundColor: "#FF0080",
        borderColor: "#FF8C00",
      },
    ],
  };

  return (
    <>
      <div className="container" data-testid="homepage">
        <h1>Statistics</h1>
        {chartData ? (
          <Line className="chart" data={chartData} />
        ) : (
          <p>Data Loading</p>
        )}
        {chartData ? (
          <Bar className="chart" data={painKillerData} />
        ) : (
          <p>Data Loading</p>
        )}
      </div>
    </>
  );
}
