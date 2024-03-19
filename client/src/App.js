import React from "react";
import { BrowserRouter, Routes,Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"
// import { Create } from "./Create";
import {Home} from "./components/Home.jsx"
import {Create} from "./components/Create.jsx"
import Read from "./components/Read.jsx"
import Update from "./components/Update.jsx"
import Login from "./components/Login.jsx"
import Register from "./components/Register.jsx"



function App(){
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/create" element={<Create />} />
      <Route path="/read/:id" element={<Read />}/>
      <Route path="/edit/:id" element={<Update />}/>
      <Route path="/login" element={<Login />}/>
      <Route path="/register" element={<Register />}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App