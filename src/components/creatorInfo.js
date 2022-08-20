import React from "react";
import pfp from "../images/pfp.jpeg";
import github from "../images/github.png";
import linkedIn from "../images/linkedin.png";
import "../styles/info.css";

export default function CreatorInfo() {
  return (
    <div className="createdBy">
      <h2>Created By</h2>
      <img src={pfp} alt="pfp" className="pfp" />
      <h3>MaximilianFullStack</h3>
      <div>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://github.com/MaximilianFullStack"
        >
          <img src={github} alt="githubLink" className="socialLinks" />
        </a>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://www.linkedin.com/in/maximilianfullstack/"
        >
          <img src={linkedIn} alt="linkedinLink" className="socialLinks" />
        </a>
      </div>
    </div>
  );
}
