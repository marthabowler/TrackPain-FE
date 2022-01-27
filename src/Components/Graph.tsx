import { PainType } from "../utils/Types/PainType";
import { Line } from "react-chartjs-2";
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
  ChartData,
} from "chart.js";
import { UserConditionsType } from "../utils/Types/UserConditionType";

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
  signedInUserConditions: UserConditionsType[];
  painData: PainType[];
}

export default function Graph(props: GraphProps): JSX.Element {
  const finalCondtionsArray: number[] = [];
  Object.values(props.signedInUserConditions).forEach((element) => {
    !finalCondtionsArray.includes(element.condition_id) &&
      finalCondtionsArray.push(element.condition_id);
  });
  console.log(props.painData);

  function createChartData(
    singlePainData: PainType[]
  ): ChartData<"line", number[], string> {
    const data = {
      labels: singlePainData.map((dataPoint: { time: string }) =>
        moment(dataPoint.time).format("MMMM Do YYYY, h:mm:ss a")
      ),

      datasets: [
        {
          label: "pain level",
          data: singlePainData.map(
            (dataPoint: { seriousness: number }) => dataPoint.seriousness
          ),
          backgroundColor: "#FF0080",
          borderColor: "#FF8C00",
        },
      ],
    };
    return data;
  }

  return (
    <>
      <div className="container" data-testid="homepage">
        <h1>Statistics</h1>
        {finalCondtionsArray.map((element, index) => (
          <div key={index}>
            <p>
              {
                props.painData.find(
                  (condition) => condition.condition_id === element
                )?.condition_name
              }
            </p>
            <Line
              className="chart"
              data={createChartData(
                props.painData.filter(
                  (condition) => condition.condition_id === element
                )
              )}
            />
          </div>
        ))}
      </div>
    </>
  );
}
