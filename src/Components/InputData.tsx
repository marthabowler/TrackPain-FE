import axios from "axios";
import { useState } from "react";
import { ConditionsType } from "../utils/Types/ConditionsType";
import { InputType } from "../utils/Types/InputType";
import { PainkillerType } from "../utils/Types/PainkillerType";
import { Link } from "react-router-dom";
import { PainType } from "../utils/Types/PainType";
import { UserConditionsType } from "../utils/Types/UserConditionType";
import { UserType } from "../utils/Types/UserType";

interface InputDataProps {
  conditionsData: ConditionsType[];
  painkillerData: PainkillerType[];
  setPainkillerData: (input: PainkillerType[]) => void;
  setConditionsData: (input: ConditionsType[]) => void;
  setPainData: (input: PainType[]) => void;
  setSignedUserConditions: (input: UserConditionsType[]) => void;
  signedInUser: UserType;
}

const apiBaseURL = process.env.REACT_APP_API_BASE;

const colours = [
  "secondary",
  "primary",
  "success",
  "danger",
  "warning",
  "info",
  "dark",
  "light",
];

function randomIntFromInterval(colours: string[]) {
  // min and max included
  return colours[Math.floor(Math.random() * (colours.length - 1 - 0 + 1) + 0)];
}

interface medicationTakenType {
  name: string;
  colour: string;
}

const medicationTaken: medicationTakenType[] = [];

export function InputData(props: InputDataProps): JSX.Element {
  const [input, setInput] = useState<InputType>({
    seriousness: 0,
    painkiller_name: "",
    condition_name: "",
  });
  const [hover, setHover] = useState(0);

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
                  <i className="large material-icons">add_circle</i>
                </button>
              );
            })}
          </div>
        </div>
        <br />
        <br />
        <div className="form-group">
          <h3>What condition are you suffering with?</h3>
          <div className="condition-dropdown">
            <select
              className="form-select form-control"
              aria-label="default"
              value={input.condition_name}
              onChange={(e) =>
                setInput({ ...input, condition_name: e.target.value })
              }
            >
              <option>Choose a condition</option>
              {props.conditionsData.map((condition, index) => (
                <option key={index}>{condition.condition_name}</option>
              ))}
            </select>
          </div>
          <input
            type="text"
            placeholder="Add a new condition"
            className="form-control"
            onChange={(e) =>
              setInput({ ...input, condition_name: e.target.value })
            }
          />
        </div>
        <button
          className="btn btn-info"
          id="add-tag-button"
          data-backdrop="static"
          data-keyboard="false"
          onClick={(e) => {
            e.preventDefault();
            handleAddCondition(
              input,
              props.conditionsData,
              props.setConditionsData
            );
          }}
        >
          Add condition
        </button>
        <br />
        <div className="form-group">
          <label>
            Which painkiller did you take in the last 4 hours (if any)?
          </label>
          <div className="condition-dropdown">
            <select
              className="form-select form-control"
              aria-label="default"
              onChange={(e) => {
                setInput({ ...input, painkiller_name: e.target.value });
                !medicationTaken.find(
                  (element) => element.name === e.target.value
                ) &&
                  medicationTaken.push({
                    name: e.target.value,
                    colour: randomIntFromInterval(colours),
                  });
              }}
            >
              <hr />
              <option>
                What medication have you taken in the last four hours?
              </option>
              {props.painkillerData.map((painkiller, index) => (
                <option key={index}>{painkiller.painkiller_name}</option>
              ))}
            </select>
          </div>
          <input
            type="text"
            placeholder="Add a new painkiller"
            className="form-control"
            onChange={(e) =>
              setInput({ ...input, painkiller_name: e.target.value })
            }
          />
        </div>
        <button
          className="btn btn-info"
          id="add-tag-button"
          data-backdrop="static"
          data-keyboard="false"
          onClick={(e) => {
            e.preventDefault();
            !medicationTaken.find(
              (element) => element.name === input.painkiller_name
            ) &&
              medicationTaken.push({
                name: input.painkiller_name,
                colour: randomIntFromInterval(colours),
              });
            handleAddPainkiller(
              input,
              props.painkillerData,
              props.setPainkillerData
            );
          }}
        >
          Add painkiller
        </button>
        <div>
          {medicationTaken.map((medication, index) => (
            <span
              key={index}
              className={`badge rounded-pill bg-${medication.colour} text-dark`}
            >
              {medication.name}
            </span>
          ))}
        </div>
        <Link to="/">
          <button
            type="submit"
            className="btn btn-primary"
            onClick={() => {
              handlePostPain(
                props.painkillerData,
                props.conditionsData,
                input,
                props.setPainData,
                props.setSignedUserConditions,
                props.signedInUser,
                medicationTaken
              );
            }}
          >
            Submit
          </button>
        </Link>
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
  painkillerData: PainkillerType[],
  setPainkillerData: (input: PainkillerType[]) => void
) {
  if (
    painkillerData.filter(
      (element) => element.painkiller_name === inputForm.painkiller_name
    ).length === 0 &&
    inputForm.painkiller_name !== ""
  ) {
    try {
      console.log(inputForm.painkiller_name);
      await axios.post(`${apiBaseURL}painkiller`, {
        painkiller_name: inputForm.painkiller_name,
      });
      const painkillerResponse = await axios.get(`${apiBaseURL}painkillers`);
      setPainkillerData(painkillerResponse.data.data);
    } catch (err) {
      console.log(err);
    }
  }
}

async function handleAddCondition(
  inputForm: InputType,
  conditionData: ConditionsType[],
  setConditionsData: (input: ConditionsType[]) => void
) {
  if (
    !conditionData.find(
      (element) => element.condition_name === inputForm.condition_name
    ) &&
    inputForm.condition_name !== ""
  ) {
    try {
      await axios.post(`${apiBaseURL}conditions`, {
        condition_name: inputForm.condition_name,
      });
      const conditionsResponse = await axios.get(`${apiBaseURL}conditions`);
      setConditionsData(conditionsResponse.data.data);
    } catch (err) {
      console.log(err);
    }
  }
}

async function handlePostPain(
  painkillerData: PainkillerType[],
  conditionData: ConditionsType[],
  inputForm: InputType,
  setPainData: (input: PainType[]) => void,
  setSignedUserConditions: (input: UserConditionsType[]) => void,
  signedInUser: UserType,
  medicationTaken: medicationTakenType[]
) {
  for (const medication of medicationTaken) {
    if (inputForm.condition_name !== "") {
      try {
        await axios.post(`${apiBaseURL}pain`, {
          seriousness: inputForm.seriousness,
          condition_id: findConditionsID(
            inputForm.condition_name,
            conditionData
          ),
          painkiller_id: findPainkillerID(medication.name, painkillerData),
        });
        const painResponse = await axios.get(`${apiBaseURL}pain`);
        setPainData(painResponse.data.data);
        const signedInUserResponse = await axios.get(
          `${apiBaseURL}user/${signedInUser.user_id}`
        );
        setSignedUserConditions(signedInUserResponse.data.data);
      } catch (err) {
        console.log(err);
      }
    }
  }
}
