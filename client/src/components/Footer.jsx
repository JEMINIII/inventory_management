import React from 'react'
import Logo  from "../images/5-removebg-preview.png"

function Footer() {
  return (
    <footer>
      <img style={{height:"60px"}} src={Logo} alt="" />
      <span>
        Made with <span role="img" aria-label="Love">❤️</span> and <b>React.js</b>
      </span>
    </footer>
  )
}

export default Footer