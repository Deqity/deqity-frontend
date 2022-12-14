import React, { useState } from "react";
import "../styles/searchPage.css";

export default function Company(props) {
  let rendered;

  const [description, setDescription] = useState("");

  function loadText() {
    fetch(`https://${props.cid}.ipfs.nftstorage.link/description.txt`, {
      method: "GET",
      mode: "no-cors",
    }).then((r) => {
      r.text().then((d) => setDescription(d));
    });
  }

  if (props.name !== "") {
    rendered = true;
    if (description === "") {
      loadText();
    }
  }
  return (
    <div className="company">
      {rendered ? (
        <div className="content">
          <a href={`/company?${props.name}-${props.symbol}`}>
            <div className="content">
              <img
                src={`https://${props.cid}.ipfs.nftstorage.link/image.jpeg`}
                alt="placeholderImg"
              />
              <div className="g">
                <h1>{`${props.name} (${props.symbol})`}</h1>
                <p>{description}</p>
                {props.activeSale ? (
                  <h4 className="saleData">
                    Selling {props.sharesForSale} shares for{" "}
                    {props.dillutionPrice}Ξ per share
                  </h4>
                ) : (
                  <h4 className="noActiveBanner">No active dilution sale.</h4>
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
