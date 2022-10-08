import React, { useState, useRef } from "react";
import ConnectMenu from "./ConnectMenu";
import logo from "../images/deqityLogo.png";
import mag from "../images/search.png";
import "../styles/nav.css";

export default function AppNavbar() {
  const [searchIsActive, setSearchIsActive] = useState(false);
  const ref = useRef(null);

  function Dropdown() {
    return <div className="searchMenu"></div>;
  }

  const handleClick = () => {
    ref.current.focus();
  };

  React.useEffect(() => {
    const search = document.querySelector("input");
    search.addEventListener("focusin", () => {
      setSearchIsActive(true);
    });
    search.addEventListener("focusout", () => {
      setSearchIsActive(false);
    });
  }, []);

  return (
    <>
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
            <div className="searchBar" onClick={handleClick}>
              <img src={mag} alt="" />
              <input ref={ref} placeholder="Search" />
            </div>
          </div>
          <a href="/tokenize" className="create">
            Tokenize Company
          </a>
          <ConnectMenu></ConnectMenu>
        </div>
      </nav>
      {searchIsActive ? Dropdown() : <></>}
    </>
  );
}
