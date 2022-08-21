import React from "react";
import meta from "../images/metamask.png";
import "../styles/connectButton.css";

export default function ConnectButton() {
  async function connectWalletHandeler() {
    if (window.ethereum !== "undefined") {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          accountChangedHandler(result[0]);
        });
    } else {
      console.log("Install metamask");
    }
  }

  function accountChangedHandler(account) {}

  window.ethereum.on("accountsChanged", (accounts) => {
    window.location.reload();
  });

  window.ethereum.on("chainChanged", (chainId) => {
    window.location.reload();
  });

  return (
    <>
      <button onClick={connectWalletHandeler} className="connectButton">
        <img src={meta} alt="logo" />
        MetaMask
      </button>
    </>
  );
}
