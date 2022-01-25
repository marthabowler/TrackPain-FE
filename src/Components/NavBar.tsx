import { Link, useLocation } from "react-router-dom";

export default function NavBar(): JSX.Element {
  const location = useLocation();
  return (
    <div className="navbar-container">
      <nav className="navbar navbar-expand-lg navbar-light bg-info">
        <div className="container-fluid">
          <div className="track-health-title">
            <h1>TrackPain</h1>
          </div>
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link
                to="/"
                className={
                  "link nav-link " +
                  `${location.pathname === "/" ? "active" : ""}`
                }
              >
                Data Overview
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/data"
                className={
                  "link nav-link " +
                  `${location.pathname === "/data" ? "active" : ""}`
                }
              >
                Interesting Data
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/input-data"
                className={
                  "link nav-link " +
                  `${location.pathname === "/input-data" ? "active" : ""}`
                }
              >
                Add Data
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}
