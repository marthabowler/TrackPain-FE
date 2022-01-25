export function InputData(): JSX.Element {
  const painLevel = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  return (
    <>
      <h1>Input Data</h1>
      <br />
      <form className="input-data">
        <div className="form-group">
          <label>How much pain are you in?</label>
          <br />
          {painLevel.map((level) => (
            <div key={level} className="form-check form-check-inline">
              <input className="form-check-input" type="radio" />
              <label className="form-check-label">{level}</label>
            </div>
          ))}
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
