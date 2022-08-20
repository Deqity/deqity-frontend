import React from "react";
import CompanyInfo from "../components/CompanyInfo";
import AppNavbar from "../components/AppNavbar";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import "../styles/company.css";

export default function CompanyPage() {
  const { search } = useLocation();
  const { chain } = queryString.parse(search);

  return (
    <>
      <AppNavbar />
      <CompanyInfo />
    </>
  );
}
