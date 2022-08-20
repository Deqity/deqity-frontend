import React, { useState } from "react";
import { ethers } from "ethers";
import "../styles/company.css";

import { abi } from "../constants";

export default function PeerToPeerSale(props) {
  let rendered;

  const [shareInput, setShareInput] = useState();

  function getShareInput(value) {
    setShareInput(value.target.value);
  }

  async function buyPrivateShares() {
    if (shareInput > 0) {
      if (
        ethers.utils.formatEther(props.peerSharesForSale.toString()) >=
        shareInput
      ) {
        const unformatValue =
          ethers.utils.formatEther(props.priceOfShares.toString()) * shareInput;

        const provider = await new ethers.providers.Web3Provider(
          window.ethereum
        );
        const signer = await provider.getSigner();
        const signerAddr = await signer.getAddress();
        const userBal = await provider.getBalance(signerAddr);

        if (ethers.utils.formatEther(userBal) > unformatValue) {
          const equity = new ethers.Contract(
            props.equityAddress,
            abi.equity,
            signer
          );
          await equity.buyPeerToPeerShares(
            props.peerAddress,
            ethers.utils.parseEther(shareInput.toString()),
            { value: ethers.utils.parseEther(unformatValue.toString()) }
          );
        } else {
          console.log("User balance too low");
        }
      } else {
        console.warn("Not enough shares for sale");
      }
    } else {
      console.warn("Zero value input");
    }
  }

  if (props.peerSharesForSale > 0) {
    rendered = true;
  }
  return (
    <div className="peerSale">
      {rendered ? (
        <>
          <h3 className="peerSeller">
            {props.peerAddress.slice(0, 5) +
              "..." +
              props.peerAddress.slice(
                props.peerAddress.length - 4,
                props.peerAddress.length
              )}
          </h3>
          <h4 className="peerShares">
            Shares for Sale:{" "}
            {ethers.utils.formatEther(props.peerSharesForSale.toString())}
          </h4>
          <h4 className="peerPrice">
            {ethers.utils.formatEther(props.priceOfShares.toString())}Ξ per
            Share
          </h4>
        </>
      ) : (
        <h3>Address</h3>
      )}
      <input
        type="number"
        min="0"
        placeholder="Shares"
        className="privateBuyInput"
        onChange={getShareInput}
      />
      <button className="peerBuy" onClick={buyPrivateShares}>
        Buy From Seller
      </button>
    </div>
  );
}
