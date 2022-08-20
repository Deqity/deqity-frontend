import React, { useState } from "react";
import { Web3Storage } from "web3.storage";
import placeholder from "../images/companyPlaceholder.jpg";

export default function Company(props) {
  let rendered;

  async function retrieve() {
    if (rendered === true) {
      const web3StorageApi = process.env.REACT_APP_STORAGE;
      const storage = new Web3Storage({ token: web3StorageApi });
      const res = await storage.get(props.cid);
      const files = await res.files();
    }
  }

  if (props.name !== "") {
    rendered = true;
    retrieve();
  }
  return (
    <div className="company">
      {rendered ? (
        <div className="content">
          <a href={`/company?${props.name}-${props.symbol}`}>
            <div className="content">
              <img src={placeholder} alt="placeholderImg" />

              <div className="g">
                <h1>{`${props.name} (${props.symbol})`}</h1>

                <p>a</p>
                {props.activeSale ? (
                  <h4>
                    Selling {props.sharesForSale} shares for{" "}
                    {props.dillutionPrice}Ξ per share
                  </h4>
                ) : (
                  <h4 className="noActiveSale">No active dillution sale.</h4>
                )}
              </div>
            </div>
          </a>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
