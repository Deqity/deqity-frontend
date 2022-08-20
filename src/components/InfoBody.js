import React from "react";
import logo from "../images/deqityLogo.png";

export default function InfoBody() {
  return (
    <>
      <div className="title">
        <img src={logo} alt="logo" />
        <div className="nameADesc">
          <h1>Deqity Protocol</h1>
          <h3>Buy and Sell Tokenized Equity On Chain</h3>
          <a href="/companies">
            <button className="tryButton">Try It!</button>
          </a>
          <p>Created for the 2022 Polygon Buidl It Hackathon</p>
        </div>
      </div>
      <div className="infoSection"></div>
    </>
  );
}
