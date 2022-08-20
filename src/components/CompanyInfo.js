import React, { useState } from "react";
import { ethers } from "ethers";
import PeerToPeerSale from "./peerToPeerSale.js";
import "../styles/company.css";

import { abi, contractAddresses } from "../constants";

export default function CompanyInfo() {
  const [contractAddress, setContractAddress] = useState("");

  //contract sale data
  const [dillutionStatus, setDillutionStatus] = useState(false);
  const [privateSalesStatus, setPrivateSalesStatus] = useState(false);
  const [peerSaleData, setPeerSaleData] = useState([
    {
      seller: "",
      peerSharesForSale: "",
      priceOfShares: "",
      contract: "",
    },
  ]);

  //contract number data
  const [supply, setSupply] = useState("");
  const [shareholders, setShareholders] = useState("");
  const [sharePrice, setSharePrice] = useState("");
  const [sharesForSale, setSharesForSale] = useState("");

  //user data
  const [isOwnerStatus, setIsOwnerStatus] = useState(false);
  const [userPrivateSaleStatus, setUserPrivateSaleStatus] = useState(false);
  const [isInitialShareholder, setIsInititalShareholder] = useState(false);
  const [userShares, setUserShares] = useState("");
  const [userEquity, setUserEquity] = useState("");

  //input data
  const [dillutionSharesStartInput, setDillutionSharesStartInput] =
    useState("");
  const [dillutionPriceStartInput, setDillutionPriceStartInput] = useState("");

  const [dillutionSharesBuyInput, setDillutionSharesBuyInput] = useState("");

  const [privateSharesStartInput, setPrivateSharesStartInput] = useState("");
  const [privatePriceStartInput, setPrivatePriceStartInput] = useState("");

  const url = window.location.href;
  const nameAndSymbol = url.substring(url.lastIndexOf("?") + 1);

  let name = nameAndSymbol.substring(0, nameAndSymbol.indexOf("-"));
  name = name.replaceAll("%20", " ");

  const symbol = nameAndSymbol.substring(nameAndSymbol.lastIndexOf("-") + 1);

  const RPC = `https://polygon-mumbai.g.alchemy.com/v2/${process.env.REACT_APP_RPC_PROVIDER}`;

  //start dillution
  function getDillutionSharesStartInput(value) {
    setDillutionSharesStartInput(value.target.value);
  }
  function getDillutionPriceStartInput(value) {
    setDillutionPriceStartInput(value.target.value);
  }

  async function startDillutionSale() {
    if (isOwnerStatus === true) {
      if (dillutionStatus === false) {
        if (dillutionSharesStartInput > 0 && dillutionPriceStartInput > 0) {
          const provider = await new ethers.providers.Web3Provider(
            window.ethereum
          );
          const signer = await provider.getSigner();

          const equity = new ethers.Contract(
            contractAddress,
            abi.equity,
            signer
          );

          try {
            await equity.startDillutionSale(
              ethers.utils.parseEther(dillutionSharesStartInput.toString()),
              ethers.utils.parseEther(dillutionPriceStartInput.toString())
            );
          } catch (e) {
            console.log(e);
          }
        } else {
          console.warn("zero value inputs");
        }
      } else {
        console.warn("there musnt be an active dillution sale");
      }
    } else {
      console.warn("only owner can preform this action");
    }
  }

  //buy dilution
  function getDillutionSharesBuyInput(value) {
    setDillutionSharesBuyInput(value.target.value);
  }

  async function buyDillutionShares() {
    if (dillutionSharesBuyInput > 0) {
      if (dillutionSharesBuyInput <= sharesForSale) {
        const unformatValue = sharePrice * dillutionSharesBuyInput;

        const provider = await new ethers.providers.Web3Provider(
          window.ethereum
        );
        const signer = await provider.getSigner();
        const signerAddr = await signer.getAddress();
        const userBal = await provider.getBalance(signerAddr);

        if (ethers.utils.formatEther(userBal) > unformatValue) {
          const equity = new ethers.Contract(
            contractAddress,
            abi.equity,
            signer
          );

          try {
            await equity.buyDillutionShares(
              ethers.utils.parseEther(dillutionSharesBuyInput),
              { value: ethers.utils.parseEther(unformatValue.toString()) }
            );
          } catch (e) {
            console.log(e);
          }
        } else {
          console.warn("User balance too low");
        }
      } else {
        console.warn("Inputed shares is a higher value than available shares");
      }
    } else {
      console.warn("Zero value input");
    }
  }

  //start private
  function getPrivateSharesStartInput(value) {
    setPrivateSharesStartInput(value.target.value);
  }
  function getPrivatePriceStartInput(value) {
    setPrivatePriceStartInput(value.target.value);
  }

  async function startPrivateSale() {
    if (privateSharesStartInput > 0 && privatePriceStartInput > 0) {
      if (userShares > dillutionSharesStartInput) {
        const provider = await new ethers.providers.Web3Provider(
          window.ethereum
        );
        const signer = await provider.getSigner();

        const equity = new ethers.Contract(contractAddress, abi.equity, signer);

        try {
          await equity.startPeerToPeerSale(
            ethers.utils.parseEther(privateSharesStartInput.toString()),
            ethers.utils.parseEther(privatePriceStartInput.toString())
          );
        } catch (e) {
          console.log(e);
        }
      } else {
        console.warn("cant sell more shares than you own");
      }
    } else {
      console.warn("zero value inputs");
    }
  }

  async function alterPrivateSale() {
    if (privateSharesStartInput > 0 && privatePriceStartInput > 0) {
      if (userShares > dillutionSharesStartInput) {
        const provider = await new ethers.providers.Web3Provider(
          window.ethereum
        );
        const signer = await provider.getSigner();
        const signerAddr = await signer.getAddress();

        const equity = new ethers.Contract(contractAddress, abi.equity, signer);

        try {
          await equity.alterPeerToPeerSale(
            signerAddr,
            ethers.utils.parseEther(privateSharesStartInput.toString()),
            ethers.utils.parseEther(privatePriceStartInput.toString())
          );
        } catch (e) {
          console.log(e);
        }
      } else {
        console.warn("cant sell more shares than you own");
      }
    } else {
      console.warn("zero value inputs");
    }
  }

  async function getData() {
    const alchemy = new ethers.providers.JsonRpcProvider(RPC);

    const factory = new ethers.Contract(
      contractAddresses.factory,
      abi.factory,
      alchemy
    );

    let personalShares, personalEquity;
    try {
      const equityAddress = await factory.getEquityAddress(name, symbol);
      setContractAddress(equityAddress);

      const equity = new ethers.Contract(equityAddress, abi.equity, alchemy);

      const tSupply = await equity.totalSupply();
      const shareHolders = await equity.numOfShareHolders();
      const status = await equity.getContractStatus();
      const numOfPrivateSales = await equity.numOfPeerToPeerSales();

      const owner = await equity.owner();

      const provider = await new ethers.providers.Web3Provider(window.ethereum);
      const signer = await provider.getSigner();

      if (numOfPrivateSales.toString() > 0) {
        setPrivateSalesStatus(true);

        for (let i = 0; i < numOfPrivateSales; i++) {
          const peerAddress = await equity.peerSellers(i);
          let peerSharesForSale = await equity.peerToPeerSharesForSale(
            peerAddress
          );
          peerSharesForSale = peerSharesForSale.toString();

          let priceOfShares = await equity.peerToPeerSharePrice(peerAddress);
          priceOfShares = priceOfShares.toString();

          peerSaleData[i] = {
            peerAddress,
            peerSharesForSale,
            priceOfShares,
            equityAddress,
          };
        }
      }

      if (signer !== undefined) {
        const signerAddr = await signer.getAddress();
        const initalEquity = await equity.initialEquity(signerAddr);
        personalShares = await equity.shareHolderShares(signerAddr);
        personalEquity = await equity.equity(signerAddr);

        if (initalEquity.toString() > 0) {
          setIsInititalShareholder(true);
        }
        if (signerAddr === owner) {
          setIsOwnerStatus(true);
        }
        if (numOfPrivateSales.toString() > 0) {
          const personalSale = await equity.peerToPeerSharesForSale(signerAddr);
          if (personalSale.toString() > 0) {
            setUserPrivateSaleStatus(true);
          }
        }
      } else {
        personalShares = 0;
        personalEquity = 0;
      }

      setShareholders(shareHolders.toString());
      setSupply(ethers.utils.formatEther(tSupply.toString()));

      setUserShares(ethers.utils.formatEther(personalShares.toString()));
      setUserEquity((personalEquity / ethers.utils.parseEther("1")) * 100);

      if (status[0] === 1) {
        setDillutionStatus(true);
        const maxDilltuionShares = await equity.totalShares();
        const price = await equity.dillutionSharePrice();
        setSharesForSale(
          ethers.utils.formatEther(
            maxDilltuionShares.sub(tSupply.toString()).toString()
          )
        );
        setSharePrice(ethers.utils.formatEther(price.toString()));
      }
    } catch (e) {
      console.log(e);
    }
  }

  window.onload = getData;

  const peerToPeerSales = peerSaleData.map((item, index) => (
    <PeerToPeerSale key={index} {...item} />
  ));
  return (
    <div className="companyInfo">
      <div className="companyBox">
        <h1>
          {name} ({symbol})
        </h1>
        <div className="info">
          <div>
            <h4>Total Shares:</h4>
            <h4>Number of Shareholders:</h4>
            <h4>Your Shares:</h4>
            <h4>Your Equity:</h4>
          </div>
          <div>
            <h4>{parseFloat(supply).toFixed(2)}</h4>
            <h4>{shareholders}</h4>
            <h4>{parseFloat(userShares).toFixed(2)}</h4>
            <h4>{parseFloat(userEquity).toFixed(2)}%</h4>
          </div>
        </div>
        {dillutionStatus ? (
          !isInitialShareholder ? (
            <>
              <h2 className="dullutionTitle">Active Dilution Sale:</h2>
              <div className="dillutionInfo">
                <h3>{`${sharesForSale} Shares for sale`}</h3>
                <h3>{`${sharePrice}Ξ per Share`}</h3>
              </div>
              <div>
                <input
                  type="number"
                  min="0"
                  placeholder="Shares"
                  className="startSaleInput"
                  onChange={getDillutionSharesBuyInput}
                />
                <button className="buyDil" onClick={buyDillutionShares}>
                  Buy Dilution Shares
                </button>
              </div>
            </>
          ) : (
            <h3 className="noActiveSale">
              Inital Shareholders cannot participate in dillution sale.
            </h3>
          )
        ) : (
          <h3 className="noActiveSale">No active dilution sale.</h3>
        )}
        <h2 className="privateSales">Private Sales:</h2>
        {privateSalesStatus ? (
          <div className="peerToPeerCards">{peerToPeerSales}</div>
        ) : (
          <h3 className="noActiveSales">No active private sales.</h3>
        )}
      </div>
      {isOwnerStatus && !dillutionStatus ? (
        <div className="startSale">
          <input
            type="number"
            min="0"
            placeholder="Shares"
            className="startSaleInput"
            onChange={getDillutionSharesStartInput}
          />
          <input
            type="number"
            min="0"
            placeholder="Share Price"
            className="startSaleInput"
            onChange={getDillutionPriceStartInput}
          />
          <button className="startButton" onClick={startDillutionSale}>
            Start Dilution Sale
          </button>
        </div>
      ) : (
        <></>
      )}
      {userShares > 0 ? (
        <div className="startSale">
          <input
            type="number"
            min="0"
            placeholder="Shares"
            className="startSaleInput"
            onChange={getPrivateSharesStartInput}
          />
          <input
            type="number"
            min="0"
            placeholder="Share Price"
            className="startSaleInput"
            onChange={getPrivatePriceStartInput}
          />
          {!userPrivateSaleStatus ? (
            <button className="startButton" onClick={startPrivateSale}>
              Start Private Sale
            </button>
          ) : (
            <button className="startButton" onClick={alterPrivateSale}>
              Alter Private Sale
            </button>
          )}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
