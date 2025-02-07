import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faYoutube,
    faTelegram,
    faTwitter,
    faDiscord,
    faMedium,
    faGithub
  } from "@fortawesome/free-brands-svg-icons";

export default function SocialFollow() {
  return (
    <div className="social-container">

<a href="https://twitter.com/AmongUsFinance" rel="noopener noreferrer" target="_blank" className="twitter social">
  <FontAwesomeIcon icon={faTwitter} size="2x" />
</a>

<a href="https://medium.com/@amongusfinance" rel="noopener noreferrer" target="_blank"
  className="medium social">
  <FontAwesomeIcon icon={faMedium} size="2x" />
</a>
    
<a href="https://t.me/amongusfinance" rel="noopener noreferrer" target="_blank"
  className="facebook social">
  <FontAwesomeIcon icon={faTelegram} size="2x" />
</a>

<a href="https://github.com/aufgames" rel="noopener noreferrer" target="_blank"
  className="instagram social">
  <FontAwesomeIcon icon={faGithub} size="2x" />
</a>

    </div>
  );
}
