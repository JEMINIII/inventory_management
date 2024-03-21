import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

const Read = () => {
  const { id } = useParams();
  const [stock, setStock] = useState([]);
  const [data, setData] = useState([]);
  useEffect(() => {
    axios.get(`http://localhost:8082/read/${id}`)
      .then(res => {
        console.log(res.data.image);
        setStock(res.data);
        if (res.data.length > 0) {
          setData(res.data);
        }
      })
      .catch(err => console.log(err));
  }, [id,data]);

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-header">
          <h2 className="mb-0">Product Details</h2>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <strong>Product ID:</strong> {stock?.product_id}
          </div>
          <div className="mb-3">
            <strong>Product Name:</strong> {stock?.product_name}
          </div>
          <div className="mb-3">
            <strong>Category:</strong> {stock?.category}
          </div>
          <div className="mb-3">
            <strong>Price:</strong> {stock?.price}
          </div>
          <div className="mb-3">
            <strong>Quantity:</strong> {stock?.quantity}
          </div>
          <div className="mb-3">
            <strong>Total Amount:</strong> {stock?.total_amount}
          </div>
          <div className="mb-3">
            <strong>Image:</strong>{" "}
            <img src="data:image/jpg;base64,aW1hZ2VfMTcxMTAxNTM2ODU0MS5qcGc=" style={{ maxWidth: "20%", height: "auto" }} alt="Product" />
          </div>

          <div className="mt-3">
            <Link to="/" className="btn btn-primary me-2">
              Back
            </Link>
            <Link to={`/edit/${stock[0]?.product_id}`} className="btn btn-info">
              Edit
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Read;
