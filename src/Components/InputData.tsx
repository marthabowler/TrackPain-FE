import { useState } from "react";
import { InputType } from "../utils/Types/InputType";

export function InputData(): JSX.Element {
  const [input, setInput] = useState<InputType>({
    seriousness: 0,
    description: "",
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
          />
        </div>
        <br />
        <div className="form-group">
          <label>What condition is this regarding?</label>
          <input className="form-control" placeholder="Condition" />
        </div>
        <br />
        <div className="form-group">
          <label>
            Which painkiller did you take in the last 4 hours (if any)?
          </label>
          <input className="form-control" placeholder="Painkiller" />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </>
  );
}
