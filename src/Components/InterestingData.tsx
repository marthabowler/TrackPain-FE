import { PainkillerCorrelationType } from "../utils/Types/PainkillerCorrelationType";
import axios from "axios";

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
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";

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

const apiBaseURL = process.env.REACT_APP_API_BASE;

export default function InterestingData(): JSX.Element {
  const [painkillerCorrelation, setPainkillerCorrelation] = useState<
    PainkillerCorrelationType[]
  >([]);

  async function getPainkillerCorrelationData() {
    const response = await axios.get(`${apiBaseURL}correlations/painkillers`);
    setPainkillerCorrelation(response.data.data);
  }

  useEffect(() => {
    getPainkillerCorrelationData();
  }, []);

  function createDiseaseArray(
    painkillerCorrelation: PainkillerCorrelationType[]
  ) {
    const diseaseArray: number[] = [];
    for (const obj of painkillerCorrelation) {
      for (const [key, value] of Object.entries(obj)) {
        if (key === "condition_id" && !diseaseArray.includes(value)) {
          diseaseArray.push(value);
        }
      }
    }
    return diseaseArray;
  }

  function createChartData(painkillerCorrelation: PainkillerCorrelationType[]) {
    const data = {
      labels: painkillerCorrelation.map(
        (dataPoint: { painkiller_name: string }) => dataPoint.painkiller_name
      ),

      datasets: [
        {
          label: "pain level",
          data: painkillerCorrelation.map((dataPoint: { avg: string }) =>
            parseInt(dataPoint.avg)
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
        <h1>Interesting Data</h1>
        {createDiseaseArray(painkillerCorrelation).map((element, index) => (
          <div key={index}>
            <p>
              {
                painkillerCorrelation.find(
                  (condition) => condition.condition_id === element
                )?.condition_name
              }
            </p>
            <Bar
              className="chart"
              data={createChartData(
                painkillerCorrelation.filter(
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
