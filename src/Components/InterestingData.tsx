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
import { useCallback, useEffect, useState } from "react";
// import { Bar } from "react-chartjs-2";
import { hasntWorkedType } from "../utils/Types/HasntWorkedType";
import { hasWorkedType } from "../utils/Types/hasWorkedType";

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
  const [hasWorked, setHasWorked] = useState<hasWorkedType[]>([]);
  const [hasntWorked, setHasntWorked] = useState<hasntWorkedType[]>([]);
  const [interestingData, setInterestingData] = useState<dataType[]>([]);

  const getHasWorkedandHasntWorked = useCallback(async () => {
    const workedResponse = await axios.get(
      `${apiBaseURL}correlations/hasworked`
    );
    setHasWorked(workedResponse.data.data);

    const notWorkedResponse = await axios.get(
      `${apiBaseURL}correlations/notworked`
    );
    setHasntWorked(notWorkedResponse.data.data);
  }, [setHasWorked, setHasntWorked]);

  useEffect(() => {
    getHasWorkedandHasntWorked();
  }, [getHasWorkedandHasntWorked]);

  interface dataType {
    condition_name: string;
    painkiller_name: string;
    has_worked: number;
  }

  const createGraphData = useCallback(
    (hasWorked, hasntWorked) => {
      const newHasWorked = hasWorked;
      const newHasntWorked = hasntWorked;
      for (let i = 0; i < newHasWorked.length; i++) {
        for (let u = 0; u < newHasntWorked.length; u++) {
          if (
            hasWorked[i].condition_name === hasntWorked[u].condition_name &&
            hasWorked[i].painkiller_name === hasntWorked[u].painkiller_name
          ) {
            interestingData.push({
              condition_name: hasWorked[i].condition_name,
              painkiller_name: hasWorked[i].painkiller_name,
              has_worked:
                (parseInt(hasWorked[i].has_worked) /
                  (parseInt(hasntWorked[u].not_worked) +
                    parseInt(hasWorked[i].has_worked))) *
                100,
            });
            newHasWorked.splice(i, 1);

            newHasntWorked.splice(u, 1);
          }
        }
      }
      newHasWorked.forEach((element: hasWorkedType) =>
        interestingData.push({
          condition_name: element.condition_name,
          painkiller_name: element.painkiller_name,
          has_worked: 100,
        })
      );

      newHasntWorked.forEach((element: hasntWorkedType) =>
        interestingData.push({
          condition_name: element.condition_name,
          painkiller_name: element.painkiller_name,
          has_worked: 0,
        })
      );
      return interestingData;
    },
    [interestingData]
  );

  useEffect(() => {
    hasWorked.length > 0 &&
      hasntWorked.length > 0 &&
      setInterestingData(createGraphData(hasWorked, hasntWorked));
  }, [createGraphData, hasWorked, hasntWorked]);

  // function createDiseaseArray(
  //   painkillerCorrelation: PainkillerCorrelationType[]
  // ) {
  //   const diseaseArray: number[] = [];
  //   for (const obj of painkillerCorrelation) {
  //     for (const [key, value] of Object.entries(obj)) {
  //       if (key === "condition_id" && !diseaseArray.includes(value)) {
  //         diseaseArray.push(value);
  //       }
  //     }
  //   }
  //   return diseaseArray;
  // }

  // function createChartData(painkillerCorrelation: PainkillerCorrelationType[]) {
  //   const datasets = [];

  //   for (const disease of createDiseaseArray(painkillerCorrelation)) {
  //     const oneLine = {
  //       label: findConditionName(painkillerCorrelation, disease),
  //       data: filterDataByCondition(painkillerCorrelation, disease).map(
  //         (dataPoint: { avg: string }) => parseInt(dataPoint.avg)
  //       ),
  //       backgroundColor: "#FF0080",
  //       borderColor: "#FF8C00",
  //     };
  //     datasets.push(oneLine);
  //   }

  //   const data = {
  //     labels: painkillerCorrelation.map(
  //       (dataPoint: { painkiller_name: string }) => dataPoint.painkiller_name
  //     ),
  //     datasets: datasets,
  //   };
  //   return data;
  // }

  return (
    <>
      <div className="container" data-testid="homepage">
        <h1>Data Across Users</h1>
        <small>
          ⚠️Caution is advised when reading this data,correlation does not
          infer causation⚠️
        </small>

        <hr />
        {/* <Bar className="chart" data={createChartData(painkillerCorrelation)} /> */}
      </div>
    </>
  );
}

// function findConditionName(
//   painkillerCorrelation: PainkillerCorrelationType[],
//   element: number
// ) {
//   return painkillerCorrelation.find(
//     (condition) => condition.condition_id === element
//   )?.condition_name;
// }

// function filterDataByCondition(
//   painkillerCorrelation: PainkillerCorrelationType[],
//   disease: number
// ) {
//   return painkillerCorrelation.filter(
//     (condition) => condition.condition_id === disease
//   );
// }
