import React, { useState } from "react";
import ConnectButton from "./MetamaskButton";
import "../styles/connectButton.css";

export default function ConnectMenu() {
  const [openStatus, setOpen] = useState(false);

  function Menu() {
    return (
      <>
        <div className="overlay" onClick={() => setOpen(!openStatus)} />
        <div className="walletMenu">
          <h4 className="selectText">Select Wallet</h4>
          <ConnectButton />
        </div>
      </>
    );
  }

  return (
    <>
      <button className="menuButton" onClick={() => setOpen(!openStatus)}>
        Connect
      </button>
      {openStatus ? Menu() : <></>}
    </>
  );
}
