import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

const Read = () => {
  const { id } = useParams();
  const [stock, setStock] = useState([]);
    useEffect(() => {
    axios.get("http://localhost:8082/read/" + id)
      .then(res => {
        console.log(res);
        setStock(res.data);
      })
      .catch(err => console.log(err));
  }, [id]); // Include 'id' in the dependency array

  return (
    <div className="d-flex vh-100 bg primary justify-content-center align-items-center">
      <div className="w-50 bg-white rounded p-3">
        <div className="p-2">
          <h2>Customer Details</h2>
          <h3>{stock[0]?.product_id}</h3>
          <h3>{stock[0]?.product_name}</h3>
          <h3>{stock[0]?.category}</h3>
          <h3>{stock[0]?.price}</h3>
          <h3>{stock[0]?.quantity}</h3>
          <h3>{stock[0]?.total_amount}</h3>
        </div>
        <Link to="/" className="btn btn-primary me-2">Back</Link>
        <Link to={`/edit/${stock[0]?.product_id}`} className="btn btn-info">Edit</Link>
      </div>
    </div>
  );
};

export default Read;
