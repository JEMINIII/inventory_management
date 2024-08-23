import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Home } from "./pages/Home.jsx";
import { Create } from "./pages/Create.jsx";
import Read from "./pages/Read.jsx";
import Update from "./pages/Update.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import "./style.css";
import Header from "./components/Header.jsx"
import Footer from "./components/Footer.jsx";
import "./style.scss";
import Sidebar from "./components/Sidebar.jsx";
import { Layout as AntLayout } from "antd";
import Member from "./pages/Member.jsx";
import StockIn from "./pages/StockIn.jsx";
import StockOut from "./pages/StockOut.jsx";
import Team from "./pages/Team.jsx";
import { TeamProvider } from "./context/TeamContext.js";
import { OrganizationProvider } from "./context/OrgContext.js";
const { Content } = AntLayout;

const Layout = ({ toggleSidebar, isSidebarOpen }) => {
  return (
    <AntLayout style={{ background: "#ffffff" }}>
  <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        background: "transparent",
        maxHeight: "calc(98vh - 74px)"
      }}
    >
     <Sidebar />
      <div
        style={{
          paddingLeft: 40,
          paddingRight: 40,
          flex: 1,
          marginLeft: 0,
          overflow: "auto",
        }}
      >
        
  <Content> 
    
        <div>
          <Outlet />
        </div>
      
  </Content>
  </div>
        </div>
</AntLayout>

  );
};

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div>
      <OrganizationProvider>
      <TeamProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={<Layout toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />}
            >
              <Route index element={<Home />} />
              <Route path="create" element={<Create />} />
              <Route path="read/:id" element={<Read />} />
              <Route path="edit/:id" element={<Update />} />
              <Route path="member" element={<Member />} />
              <Route path="team" element={<Team />} />
              <Route path="StockIn" element={<StockIn />} />
              <Route path="StockOut" element={<StockOut />} />
            </Route>
            <Route path="login" element={<Login />} />
            {/* <Route path="register" element={<Register />} /> */}
          </Routes>
        </BrowserRouter>
      </TeamProvider>
      </OrganizationProvider>
    </div>
  );
}

export default App;
