import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

const Read = () => {
  const { id } = useParams();
  const [stock, setStock] = useState({});
  const [data, setData] = useState([]);
  
  
  useEffect(() => {
    axios
      .get(`http://localhost:8082/products/read/${id}`)
      .then((res) => {
        setStock(res.data);
        
      })
      .catch((err) => {
        console.error("Request failed:", err.message); // Log the error message
        console.error("Server response:", err.response.data); // Log the server response
      });
  }, [id]);
  

  const handleDelete = (id) => {
    axios
      .delete("http://localhost:8082/delete/" + id)
      .then((res) => {
        const updatedData = data.filter(
          (inventory) => inventory.product_id !== id
        );
        setData(updatedData);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className=" bg-light ">
      <div
        className=" bg-white rounded p-3"
        style={{
          maxHeight: "calc(85vh - 25px)",
          height: "calc(100vh - 64px)",
          overflowY: "auto",
        }}
      >
        <div className="card">
          <div className="card-header">
            <h2 className="mb-0">Product Details</h2>
          </div>
          <div className="card-body">
            <div className="mb-3">
              <strong>Product ID:</strong> {id}
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
              <strong>Image:</strong>{""}
              {stock && <img
              src={`http://localhost:8082/images/${stock.img}`}
              style={{ maxWidth: "30%", height: "auto" }}
              alt="Product"
            />}
            </div>

            <div className="mt-3">
              <Link to="/" className="btn btn-primary me-2">
                Back
              </Link>
              <Link
                to={`/edit/${id}`}
                className="btn btn-info me-2"
              >
                Edit
              </Link>
              <button
                onClick={() => {
                  handleDelete(id);
                  window.location.href = '/'; 
                }}
                className="btn btn-sm btn-danger"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Read;
