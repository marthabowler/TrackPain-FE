import { Link, useLocation } from "react-router-dom";
import { UserType } from "../utils/Types/UserType";

interface NavBarProps {
  signedInUser: UserType;
}
export default function NavBar(props: NavBarProps): JSX.Element {
  const location = useLocation();
  return (
    <div className="navbar-container">
      <nav className="navbar navbar-expand-lg navbar-light bg-info">
        <div className="container-fluid">
          <div className="track-health-title">
            <h1>🛤️Pain Tracks🛤️ </h1>
          </div>
          <ul className="navbar-nav">
            <li className="nav-item text-left">
              <Link
                to="/"
                className={
                  "link nav-link " +
                  `${location.pathname === "/" ? "active" : ""}`
                }
              >
                Your Data
              </Link>
            </li>
            <li className="nav-item text-left">
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
            <li className="nav-item text-left">
              <Link
                to="/input-data"
                className={
                  "link nav-link " +
                  `${
                    location.pathname === "/input-data" ? "active" : ""
                  } text-left`
                }
              >
                Add Data
              </Link>
            </li>
          </ul>
          <p className="log-in">
            <i>Logged in as: {props.signedInUser.username}</i>
          </p>
        </div>
      </nav>
    </div>
  );
}
