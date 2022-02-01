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
    const datasets = [];

    for (const disease of createDiseaseArray(painkillerCorrelation)) {
      const oneLine = {
        label: findConditionName(painkillerCorrelation, disease),
        data: filterDataByCondition(painkillerCorrelation, disease).map(
          (dataPoint: { avg: string }) => parseInt(dataPoint.avg)
        ),
        backgroundColor: "#FF0080",
        borderColor: "#FF8C00",
      };
      datasets.push(oneLine);
    }

    const data = {
      labels: painkillerCorrelation.map(
        (dataPoint: { painkiller_name: string }) => dataPoint.painkiller_name
      ),
      datasets: datasets,
    };
    return data;
  }

  return (
    <>
      <div className="container" data-testid="homepage">
        <h1>Data Across Users</h1>
        <small>
          ⚠️Caution is advised when reading this data, correlation does not
          infer causation⚠️
        </small>
        <hr />
        <Bar className="chart" data={createChartData(painkillerCorrelation)} />
      </div>
    </>
  );
}

function findConditionName(
  painkillerCorrelation: PainkillerCorrelationType[],
  element: number
) {
  return painkillerCorrelation.find(
    (condition) => condition.condition_id === element
  )?.condition_name;
}

function filterDataByCondition(
  painkillerCorrelation: PainkillerCorrelationType[],
  disease: number
) {
  return painkillerCorrelation.filter(
    (condition) => condition.condition_id === disease
  );
}
