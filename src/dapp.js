import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Search from "./pages/Search";
import CompanyPage from "./pages/CompanyPage";
import TokenizeCompany from "./pages/TokenizeCompany";
import Info from "./pages/Info";
import "./styles/dapp.css";

export default function Dapp() {
  return (
    <Router>
      <Routes>
        <Route path="" element={<Info />} />
        <Route path="/companies" element={<Search />} />
        <Route path="/company" element={<CompanyPage />} />
        <Route path="/tokenize" element={<TokenizeCompany />} />
      </Routes>
    </Router>
  );
}
