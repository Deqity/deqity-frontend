import React, { useState, useRef, useEffect } from "react";
import { ethers } from "ethers";
import { Web3Storage } from "web3.storage";
import placeholder from "../images/placeholder-input-image.png";
import "../styles/tokenize.css";

import { abi, contractAddresses } from "../constants";

export default function Tokenize() {
  // on chain
  const [holders, setHolders] = useState([{ shareholders: "", shares: "" }]);
  const [name, setName] = useState("");
  const [symbol, setSymobl] = useState("");

  // off chain
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const fileInputRef = useRef();

  useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(image);
    } else {
      setPreview(null);
    }
  }, [image]);

  function getNameInput(value) {
    setName(value.target.value);
  }

  function getSymbolInput(value) {
    setSymobl(value.target.value);
  }

  function getDescription(value) {
    setDescription(value.target.value);
  }

  function getImageFile(value) {
    const file = value.target.files[0];
    if (file && file.type.substr(0, 5) === "image") {
      setImage(file);
    } else {
      setImage(file);
    }
  }

  function onChange(index, event) {
    event.preventDefault();
    event.persist();

    let data = [...holders];
    holders[index][event.target.name] = event.target.value;

    setHolders(data);
  }

  function addShareholder(e) {
    e.preventDefault();
    const inputState = { shareholders: "", shares: "" };

    setHolders((prev) => [...prev, inputState]);
  }

  function handleRemoveField(e) {
    e.preventDefault();
    setHolders((prev) =>
      prev.filter((item) => item !== prev[holders.length - 1])
    );
  }

  async function IpfsUpload() {
    const web3StorageApi = process.env.REACT_APP_STORAGE;
    const storage = new Web3Storage({ token: web3StorageApi });

    const files = [
      new File([image], "image.jpeg"),
      new File([description], "description.txt"),
    ];
    const cid = await storage.put(files);
    return cid;
  }

  async function tokenizeOrganization() {
    if (name !== "" && symbol !== "" && description !== "" && image !== null) {
      const numOfShareholders = holders.length;
      let shareholders = [];
      let shares = [];
      let validAddressInputs = true;
      let zeroValueShare = false;

      for (let i = 0; i < numOfShareholders; i++) {
        shareholders.push(holders[i]["shareholders"]);
        shares.push(ethers.utils.parseEther(holders[i]["shares"]));

        if (ethers.utils.isAddress(holders[i]["shareholders"]) === false) {
          validAddressInputs = false;
        }
        if (holders[i]["shares"] === "" || holders[i]["shares"] === "0") {
          zeroValueShare = true;
        }
      }

      if (zeroValueShare === false) {
        if (validAddressInputs === true) {
          const provider = await new ethers.providers.Web3Provider(
            window.ethereum
          );
          const signer = await provider.getSigner();

          const factory = new ethers.Contract(
            contractAddresses.factory,
            abi.factory,
            signer
          );

          try {
            const cid = await IpfsUpload();
            const tx = await factory.createEquity(
              name,
              symbol,
              cid,
              shareholders,
              shares
            );
            await tx.wait(6);
          } catch (e) {
            console.log(e);
          }
        } else {
          console.warn("One or more shareholder addresses are not valid");
        }
      } else {
        console.warn("Zero value share input");
      }
    } else {
      console.warn("Inputs cant be empty");
    }
  }

  return (
    <div className="tokenized">
      <div className="tokenizeBox">
        <h1>Tokenize Company</h1>
        <div className="imgAndInfo">
          {preview ? (
            <img
              src={preview}
              alt="Submit 400x220"
              className="imageInput"
              onClick={(e) => {
                e.preventDefault();
                fileInputRef.current.click();
              }}
            />
          ) : (
            <img
              src={placeholder}
              alt="Submit 400x220"
              className="imageInput"
              onClick={(e) => {
                e.preventDefault();
                fileInputRef.current.click();
              }}
            />
          )}
          <input
            type="file"
            style={{ display: "none" }}
            onChange={getImageFile}
            accept="image/*"
            ref={fileInputRef}
          />
          <div className="companyInfo">
            <input
              onChange={getNameInput}
              type="text"
              placeholder="Company Name"
            />
            <input
              onChange={getSymbolInput}
              type="text"
              placeholder="Company Symbol"
            />
            <input
              onChange={getDescription}
              type="text"
              placeholder="Description"
            />
          </div>
        </div>
        <form className="shareInfo">
          <div className="shareholderInputs">
            <h3>Shareholders:</h3>
            {holders.map((item, index) => {
              return (
                <div key={`item-${index}`}>
                  <input
                    name="shareholders"
                    type="text"
                    placeholder="Shareholder"
                    className="holderInput"
                    value={holders.shareholder}
                    onChange={(e) => onChange(index, e)}
                  />
                </div>
              );
            })}
            <div>
              <button
                className="addButton"
                onClick={(e) => handleRemoveField(e)}
              >
                -
              </button>
              <button onClick={addShareholder} className="addButton">
                +
              </button>
            </div>
          </div>
          <div>
            <h3>Shareholder's Shares:</h3>
            {holders.map((item, index) => {
              return (
                <div key={`item-${index}`}>
                  <input
                    name="shares"
                    type="number"
                    min="0"
                    placeholder="Shareholder's Shares"
                    className="holderInput"
                    value={holders.shares}
                    onChange={(e) => onChange(index, e)}
                  />
                </div>
              );
            })}
          </div>
        </form>
        <button onClick={tokenizeOrganization} className="tokenizeButton">
          Tokenize
        </button>
      </div>
    </div>
  );
}
