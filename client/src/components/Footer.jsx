import React from "react";
import { Link } from "react-router-dom";
// import Logo  from "../images/5-removebg-preview.png"
import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
        {/* <img style={{width:'auto',height:"60px"}} src={Logo} alt="" /> */}
        </div>
        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/privacy">Privacy Policy</Link>
        </div>
        <div className="footer-social">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 Jemini Karathiya. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
