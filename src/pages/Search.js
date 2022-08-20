import React, { useState } from "react";
import { ethers } from "ethers";
import Company from "../components/Company";
import AppNavbar from "../components/AppNavbar";
import "../styles/searchPage.css";

import { abi, contractAddresses } from "../constants";

export default function Search() {
  const [numOfCompanies, setNumOfCompanies] = useState("");
  const [companyInfo, setCompanyInfo] = useState([
    {
      name: "",
      symbol: "",
      cid: null,
      activeSale: false,
      dillutionPrice: "",
      sharesForSale: "",
    },
  ]);

  const RPC = `https://polygon-mumbai.g.alchemy.com/v2/${process.env.REACT_APP_RPC_PROVIDER}`;

  async function getData() {
    const alchemy = new ethers.providers.JsonRpcProvider(RPC);
    const factory = new ethers.Contract(
      contractAddresses.factory,
      abi.factory,
      alchemy
    );

    try {
      let numCompanies = await factory.numOfEquityContracts();
      numCompanies = numCompanies.toString();

      let activeSale, sharesForSale, dillutionPrice;
      for (let i = 0; i < numCompanies; i++) {
        const equityAddress = await factory.equityContracts(i);
        const equity = new ethers.Contract(equityAddress, abi.equity, alchemy);

        const name = await equity.name();
        const symbol = await equity.symbol();
        const contractStatus = await equity.getContractStatus();

        const cid = await equity.cid();

        if (contractStatus[0] === 1) {
          activeSale = true;
          const price = await equity.dillutionSharePrice();
          const tShares = await equity.totalShares();
          const tSupply = await equity.totalSupply();
          dillutionPrice = ethers.utils.formatEther(price.toString());
          sharesForSale = ethers.utils.formatEther(
            tShares.sub(tSupply.toString()).toString()
          );
        } else {
          activeSale = false;
          dillutionPrice = 0;
          sharesForSale = 0;
        }
        companyInfo[i] = {
          name,
          symbol,
          cid,
          activeSale,
          dillutionPrice,
          sharesForSale,
        };
        setNumOfCompanies(numCompanies);
      }
    } catch (e) {
      console.log(e);
    }
    return companyInfo;
  }

  window.onload = getData;

  const tokenizedCompanies = companyInfo.map((item, index) => (
    <Company key={index} {...item} />
  ));
  return (
    <>
      <AppNavbar />
      <div className="companyCards">{tokenizedCompanies}</div>
    </>
  );
}
