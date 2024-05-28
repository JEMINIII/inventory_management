// App.js
import React from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Home } from "./pages/Home.jsx";
import { Create } from "./pages/Create.jsx";
import Read from "./pages/Read.jsx";
import Update from "./pages/Update.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import "./style.css";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import "./style.scss";
import Sidebar from "./components/Sidebar.jsx";
import { Layout as AntLayout } from "antd";
import Member from "./pages/Member.jsx";
import StockIn from "./pages/StockIn.jsx";
import StockOut from "./pages/StockOut.jsx";
import Team from "./pages/Team.jsx";
import { TeamProvider } from "./context/TeamContext.js";

const { Content } = AntLayout;

const Layout = () => {
  return (
    <AntLayout style={{ background: "#ffffff" }}>
      <Header />
      <Footer style={{ textAlign: "center" }}>Footer</Footer>
      <Content style={{ justifyContent: "space-between" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            marginBottom: 20,
            background: "transparent",
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
            <div>
              <Outlet />
            </div>
          </div>
        </div>
      </Content>
    </AntLayout>
  );
};

function App() {
  return (
    <TeamProvider>
      <div>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
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
            <Route path="register" element={<Register />} />
          </Routes>
        </BrowserRouter>
      </div>
    </TeamProvider>
  );
}

export default App;
