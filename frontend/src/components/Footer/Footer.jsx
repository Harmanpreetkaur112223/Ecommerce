import React from "react";
import HeaderLinks from "../Navbar/HeaderLinks";
import './Footer.css'
function Footer() {
  return (
    <>
      <footer className="footer">
        <div className="upper-footer">
          <i class="fa-brands fa-instagram"></i>
          <i class="fa-brands fa-facebook"></i>
          <i class="fa-brands fa-whatsapp"></i>
          <i class="fa-brands fa-twitter"></i>
        </div>
        <div className="bottom-footer">
         <HeaderLinks/>

        </div>
      </footer>
    </>
  );
}

export default Footer;
