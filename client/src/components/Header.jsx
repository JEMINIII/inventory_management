import React, { useEffect, useState } from "react";
import Logo from "../images/4-removebg-preview.png";
import logo22 from "../images/5-removebg-preview.png";
import axios from "axios";
import { Link } from "react-router-dom";
import { MenuOutlined } from "@ant-design/icons";
import { Button, Popover } from 'antd';
import { SettingOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import './Header.css';

function Header({ toggleSidebar, isSidebarOpen }) {
  const [auth, setAuth] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8082/api/users")
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          const data = res.data;
          console.log(data);
          if (data.success === true) {
            setAuth(true);
            setName(data.name);  // Assuming `data.name` contains the user's name
          } else {
            setAuth(false);
          }
        } else {
          console.log("Unexpected response status:", res.status);
        }
      })
      .catch((err) => console.error("Error fetching user data:", err));
  }, []);

  const handleLogout = () => {
    axios
      .get("http://localhost:8082/logout", { withCredentials: true })
      .then((res) => {
        window.location.href = "/login";
      })
      .catch((err) => console.log(err));
  };

  if (!auth) {
    return null;
  }
  const menuContent = (
    <div>
      {/* <Button type="text" icon={<UserOutlined />}>
        <Link to="/profile">{name}</Link>
      </Button> */}
      <br />
      <button type="text" icon={<LogoutOutlined />} onClick={handleLogout} >
  Logout
</button>

      <br />
      
    </div>
  );


  return (
    <nav className="navbar">
      {/* <div className="toggle-button">
        <button onClick={toggleSidebar}>
          <MenuOutlined />
        </button>
      </div> */}
      <div className="logo">
        <img src={logo22} alt="" />
      </div>
      <ul className="links">
      {/* <li className="popover"> */}
        <Popover style={{backgroundColor:'black'}} content={menuContent} trigger="click" placement="bottom">
        <div style={{backgroundColor:'black',color:'white'}}>
          <UserOutlined />
        </div>
          {/* <img className="logo22" src={Logo} alt="Logo" style={{ cursor: 'pointer' }} /> */}
        </Popover>
      {/* </li> */}
    </ul>
    </nav>
  );
}

export default Header;
