import React from "react";
import logo from "../images/deqityLogo.png";
import "../styles/searchPage.css";
import "../styles/info.css";

export default function InfoNavbar() {
  return (
    <nav className="navbar">
      <div className="navItems">
        <div className="leftItems">
          <a href="/companies">
            <ul>
              <li>
                <h1>Deqity</h1>
              </li>
              <li>
                <img src={logo} alt="deqityLogo" className="navLogo" />
              </li>
            </ul>
          </a>
        </div>
        <a target="_blank" rel="noreferrer" href="https://github.com/Deqity">
          <button className="infoButtons">Github</button>
        </a>
        <a href="/companies">
          <button className="infoButtons">Launch App</button>
        </a>
      </div>
    </nav>
  );
}
