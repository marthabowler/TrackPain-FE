import axios from "axios";
import { useState } from "react";
import { ConditionsType } from "../utils/Types/ConditionsType";
import { InputType } from "../utils/Types/InputType";
import { PainkillerType } from "../utils/Types/PainkillerType";
import { PainType } from "../utils/Types/PainType";
import { UserConditionsType } from "../utils/Types/UserConditionType";
import { UserType } from "../utils/Types/UserType";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

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
  effectiveness: boolean;
}

let medicationTaken: medicationTakenType[] = [];

export function InputData(props: InputDataProps): JSX.Element {
  const [input, setInput] = useState<InputType>({
    seriousness: 0,
    condition_name: "",
  });
  const [hover, setHover] = useState(0);
  const [painkiller, setPainkiller] = useState<string>("");
  const [effectiveness, setEffectiveness] = useState<boolean>(false);

  const navigate = useNavigate();

  async function handlePostPain(
    painkillerData: PainkillerType[],
    conditionData: ConditionsType[],
    inputForm: InputType,
    setPainData: (input: PainType[]) => void,
    setSignedUserConditions: (input: UserConditionsType[]) => void,
    signedInUser: UserType
  ) {
    if (inputForm.condition_name !== "") {
      try {
        await axios.post(`${apiBaseURL}pain`, {
          seriousness: inputForm.seriousness,
          condition_id: findConditionsID(
            inputForm.condition_name,
            conditionData
          ),
        });
        navigate("/");
        toast.success("Added Pain");
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
        <div className="form-group">
          <h3>What condition are you suffering with?</h3>
          <div className="row">
            <div className="condition-dropdown col-3">
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
            <div className="col-3">
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
              className="btn btn-info col-1"
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
              Add
            </button>
          </div>
          {input.condition_name && (
            <p>Added condition: {input.condition_name}</p>
          )}
        </div>
        <br />
        <div className="form-group mt-5">
          <label>
            Which painkiller did you take in the last 4 hours (if any)?
          </label>
          <div className="painkiller row">
            <div className="condition-dropdown col-3">
              <select
                className="form-select form-control"
                aria-label="default"
                value={painkiller}
                onChange={(e) => {
                  setPainkiller(e.target.value);
                }}
              >
                <hr />
                <option>Select medication</option>
                {props.painkillerData.map((painkiller, index) => (
                  <option key={index}>{painkiller.painkiller_name}</option>
                ))}
              </select>
            </div>
            <p className="col-1">OR</p>
            <div className="new-painkiller col-3">
              <input
                type="text"
                placeholder="Add a new painkiller"
                className="form-control"
                onChange={(e) => {
                  setPainkiller(e.target.value);
                }}
              />
            </div>
            <label className="col-2">
              Has it worked?
              <input
                className="form-check-input"
                type="checkbox"
                checked={effectiveness}
                id="flexCheckDefault"
                onChange={() => {
                  setEffectiveness(!effectiveness);
                }}
              />
            </label>
          </div>
        </div>

        <button
          className="btn btn-info"
          id="add-tag-button"
          data-backdrop="static"
          data-keyboard="false"
          onClick={(e) => {
            e.preventDefault();
            handleAddPainkiller(
              painkiller,
              props.painkillerData,
              props.setPainkillerData
            );
            !medicationTaken.find((element) => element.name === painkiller) &&
              medicationTaken.push({
                name: painkiller,
                colour: randomIntFromInterval(colours),
                effectiveness: effectiveness,
              });
            setPainkiller("");
            effectiveness && setEffectiveness(!effectiveness);
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
                props.signedInUser
              );
              submitPainkillersTaken(
                medicationTaken,
                props.painkillerData,
                props.conditionsData,
                input,
                props.signedInUser
              );
              medicationTaken = [];
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
  painkiller: string,
  painkillerData: PainkillerType[],
  setPainkillerData: (input: PainkillerType[]) => void
) {
  if (
    painkillerData.filter((element) => element.painkiller_name === painkiller)
      .length === 0 &&
    painkiller !== ""
  ) {
    try {
      await axios.post(`${apiBaseURL}painkiller`, {
        painkiller_name: painkiller,
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

async function submitPainkillersTaken(
  medicationTaken: medicationTakenType[],
  painkillerData: PainkillerType[],
  conditionData: ConditionsType[],
  inputForm: InputType,
  signedInUser: UserType
) {
  for (const medication of medicationTaken) {
    try {
      await axios.post(`${apiBaseURL}painkillertaken`, {
        painkiller_id: findPainkillerID(medication.name, painkillerData),
        condition_id: findConditionsID(inputForm.condition_name, conditionData),
        user_id: signedInUser.user_id,
        has_worked: medication.effectiveness,
      });
    } catch (err) {
      console.log(err);
    }
  }
}
