import axios from "axios";
import { useState } from "react";
import { ConditionsType } from "../utils/Types/ConditionsType";
import { InputType } from "../utils/Types/InputType";
import { PainkillerType } from "../utils/Types/PainkillerType";
import { useNavigate } from "react-router-dom";

interface InputDataProps {
  conditionsData: ConditionsType[];
  painkillerData: PainkillerType[];
}

const apiBaseURL = process.env.REACT_APP_API_BASE;

export function InputData(props: InputDataProps): JSX.Element {
  const [input, setInput] = useState<InputType>({
    seriousness: 0,
    description: "",
    painkiller_name: "",
    condition_name: "",
  });
  const [hover, setHover] = useState(0);
  const navigate = useNavigate();

  async function handlePostPain(
    painkillerData: PainkillerType[],
    conditionData: ConditionsType[],
    inputForm: InputType
  ) {
    try {
      const response = await axios.post(`${apiBaseURL}pain`, {
        seriousness: inputForm.seriousness,
        description: inputForm.description,
        condition_id: findConditionsID(inputForm.condition_name, conditionData),
        painkiller_id: findPainkillerID(
          inputForm.painkiller_name,
          painkillerData
        ),
      });
      navigate("/");
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <h1>Input Data</h1>
      <br />
      <form className="input-data">
        <div className="form-group">
          <label>How much pain are you in?</label>
          <br />
          <div className="star-rating">
            {[...Array(10)].map((star, index) => {
              index += 1;
              return (
                <button
                  type="button"
                  key={index}
                  className={
                    index <= (hover || input.seriousness) ? "on" : "off"
                  }
                  onClick={() => {
                    setInput({ ...input, seriousness: index });
                  }}
                  onMouseEnter={() => setHover(index)}
                  onMouseLeave={() => setHover(input.seriousness)}
                >
                  <span className="star">&#9733;</span>
                </button>
              );
            })}
          </div>
        </div>
        <br />
        <div className="form-group">
          <label>Description</label>
          <textarea
            className="form-control"
            placeholder="Any unusual symptoms..."
            value={input.description}
            onChange={(e) =>
              setInput({ ...input, description: e.target.value })
            }
          />
        </div>
        <br />
        <div className="form-group">
          <label>What condition is this regarding?</label>
          <input
            className="form-control"
            placeholder="Condition"
            value={input.condition_name}
            onChange={(e) =>
              setInput({ ...input, condition_name: e.target.value })
            }
            onMouseLeave={() => handleAddCondition(input, props.conditionsData)}
          />
        </div>
        <br />
        <div className="form-group">
          <label>
            Which painkiller did you take in the last 4 hours (if any)?
          </label>
          <input
            className="form-control"
            placeholder="Painkiller"
            value={input.painkiller_name}
            onChange={(e) => {
              setInput({ ...input, painkiller_name: e.target.value });
              console.log(input.painkiller_name);
            }}
            onMouseLeave={() =>
              handleAddPainkiller(input, props.painkillerData)
            }
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          onClick={() => {
            handlePostPain(props.painkillerData, props.conditionsData, input);
          }}
        >
          Submit
        </button>
      </form>
    </>
  );
}

function findConditionsID(name: string, array: ConditionsType[]) {
  return array.find((element) => element.condition_name === name)?.condition_id;
}

function findPainkillerID(name: string, array: PainkillerType[]) {
  return array.find((element) => element.painkiller_name === name)
    ?.painkiller_id;
}

async function handleAddPainkiller(
  inputForm: InputType,
  painkillerData: PainkillerType[]
) {
  if (
    painkillerData.filter(
      (element) => element.painkiller_name === inputForm.painkiller_name
    ).length === 0
  ) {
    try {
      console.log(inputForm.painkiller_name);
      const response = await axios.post(`${apiBaseURL}painkiller`, {
        painkiller_name: inputForm.painkiller_name,
      });
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  }
}

async function handleAddCondition(
  inputForm: InputType,
  conditionData: ConditionsType[]
) {
  if (
    !conditionData.find(
      (element) => element.condition_name === inputForm.condition_name
    )
  ) {
    try {
      const response = await axios.post(`${apiBaseURL}conditions`, {
        condition_name: inputForm.condition_name,
      });
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  }
}
