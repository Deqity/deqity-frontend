import React from "react";
import ConnectButton from "./ConnectButton";
import logo from "../images/deqityLogo.png";
import "../styles/searchPage.css";

export default function AppNavbar() {
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
          <input
            type="search"
            placeholder="Search Companies"
            className="searchbar"
          />
        </div>
        <a href="/tokenize" className="create">
          Tokenize Company
        </a>
        <ConnectButton />
      </div>
    </nav>
  );
}
