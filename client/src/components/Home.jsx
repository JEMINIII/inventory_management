import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export const Home = () => {
  const [data, setData] = useState([]);
  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");

  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios
      .get("http://localhost:8082")
      .then((res) => {
        if (res.data.Status === "success") {
          setAuth(true);
          setName(res.data.name);
          setData(res.data.inventory)
        } else {
          setAuth(false);
          setMessage(res.data.Error);
        }
      })
      .catch((err) => console.log(err));
  },[setAuth, setMessage, setName,setData]);

  // useEffect(() => {
  //   axios
  //     .get("http://localhost:8082/")
  //     .then((res) => setData(res.data))
  //     .catch((err) => console.log(err));
  // }, []);

  const handleLogout = ()=>{
    axios.get("http://localhost:8082/logout")
    .then(res =>{
      window.location.reload();
    }).catch(err => console.log(err));
  }
  const handleDelete = (id) =>{
    axios.delete("http://localhost:8082/delete/"+id)
    .then(res => {
        setData(prevData => prevData.filter(inventory => inventory.product_id !== id));
    })
    .catch(err=> console.log(err))
  }

  return (
    <div className="container mt-4">
      {auth ? (
        <div>
          <center><h3>You are Authorized --- {name} <br /> <br /> <button className="btn btn-danger" onClick={handleLogout}>Logout</button></h3></center>
          
          <div className="d-flex bg-light justify-content-center align-items-center">
          <div className="w-75 bg-white rounded p-3">
        <h2>Customer List</h2>
        <div className="d-flex justify-content-end">
            <Link to="/create" className="btn btn-success">Create+</Link>
        </div>
        <table className="table">
        <thead>
            <tr>
            <th>ProductId</th>
            <th>ProductName</th>
            <th>Category</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Amount</th>
            </tr>
            </thead>
            <tbody>
            {data.map((inventory, index) => {
            return (
                <tr key={index}>
            <td>{inventory.product_id}</td>
            <td>{inventory.product_name}</td>
            <td>{inventory.category}</td>
            <td>{inventory.price}</td>
            <td>{inventory.quantity}</td>
            <td>{inventory.total_amount}</td>
            <td>
            <Link to={`/read/${inventory.product_id}`} className="btn btn-sm btn-info">Read</Link>
            <Link to={`/edit/${inventory.product_id}`} className="btn btn-sm btn-primary mx-2">Edit</Link>
            <button onClick={()=> handleDelete(inventory.product_id)} className="btn btn-sm btn-danger">Delete</button>
                </td>
                </tr>
            );
            })}
        </tbody>
        </table>
      </div>
        </div>
        </div>
      ) : (
        <div>
          <h3>{message}</h3>
          <h3>Login Now</h3>
          <Link to="/login" className="btn btn-primary">
            Login
          </Link>
        </div>
      )}
      
    </div>
    
  );
  
};
