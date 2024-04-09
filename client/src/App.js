import React from "react";
import { BrowserRouter, Routes,Route,Outlet } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"
// import { Create } from "./Create";
import {Home} from "./pages/Home.jsx"
import {Create} from "./pages/Create.jsx"
import Read from "./pages/Read.jsx"
import Update from "./pages/Update.jsx"
import Login from "./pages/Login.jsx"
import Register from "./pages/Register.jsx"
import "./style.css";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx"
import "./style.scss"
import Sidebar from "./components/Sidebar.jsx";
import { Layout as AntLayout } from "antd";
const { Content } = AntLayout;


const Layout = () => {
  return (
    
    
    <AntLayout style={{background:'#ffffff' }}>
    <Header />
    {/* <Content style={{ padding: "0 50px", marginTop: 20 }}>
  <div style={{ display: "flex", flexDirection: "column-reverse", marginBottom: 20 }}>
    <div style={{ flex: 1 }}>
      <div style={{ padding: 24 }}>
        <Outlet />
      </div>
    </div>
    <Sidebar />
  </div>
</Content> */}

    <Content style={{ padding: "0 50px", marginTop: 20}}>
      <div style={{ display: "flex",flexDirection:'row',marginBottom:20,overflow:"auto" }}>
        <Sidebar />
        <div style={{ flex: 1, marginLeft: 0}}>
          <div style={{padding: 24 }}>
            <Outlet />
          </div>
        </div>
      </div>
    </Content>
    <Footer style={{ textAlign: "center" }}>Footer</Footer>
  </AntLayout>
    
  );
};
function App(){
  return (
    <div className="app">
    <div className="container">
    <BrowserRouter>
    <Routes>
    <Route path="/" element={<Layout/>}>
      <Route index element={<Home />} />
      <Route path="/create" element={<Create />} />
      <Route path="/read/:id" element={<Read />}/>
      <Route path="/edit/:id" element={<Update />}/>
    </Route>
      
      <Route path="/login" element={<Login />}/>
      <Route path="/register" element={<Register />}/>
    </Routes>
    </BrowserRouter>
    </div>
    </div>
  )
}

export default App



