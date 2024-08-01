import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export const Create = () => {
  const [values, setValues] = useState({
    product_name: "",
    category: "",
    price: "",
    quantity: "",
    total_amount: "",
    team_id: "",
    product_id: null,
  });

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
      total_amount:
        name === "price" || name === "quantity"
          ? calculateTotalAmount(value)
          : values.total_amount,
    });
  };

  const calculateTotalAmount = (value) => {
    const price = parseFloat(values.price) || 0;
    const quantity = parseFloat(values.quantity) || 0;
    const newValue = parseFloat(value) || 0;
    if (isNaN(price) || isNaN(quantity) || isNaN(newValue)) {
      return values.total_amount;
    }
    return (quantity * price).toFixed(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formErrors = {};
    if (!values.product_name.trim()) {
      formErrors.product_name = "Product name is required";
    }
    if (!values.category.trim()) {
      formErrors.category = "Category is required";
    }
    if (!values.price.trim()) {
      formErrors.price = "Price is required";
    }
    if (!values.quantity.trim()) {
      formErrors.quantity = "Quantity is required";
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    const formData = new FormData();
    console.log("Values:", values);

    formData.append("product_name", values.product_name);
    formData.append("category", values.category);
    formData.append("price", values.price);
    formData.append("quantity", values.quantity);
    formData.append("total_amount", values.total_amount);
    formData.append("image", values.image);

    // console.log('FormData:', formData);
    for (var key of formData.entries()) {
      console.log(key[0] + ", " + key[1]);
    }

    axios
      .post("http://localhost:8082/products/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          enctype: "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res);
        navigate("/");
      })
      .catch((err) => console.log(err));
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    console.log("Selected file:", file);

    setValues({
      ...values,
      image: file,
    });
  };

  return (
    <div className=" bg-light justify-content-center">
      <div
        className=" bg-white rounded p-3"
        style={{
          maxHeight: "calc(85vh - 25px)",
          height: "calc(100vh - 64px)",
          overflowY: "auto",
        }}
      >
        <form className="form" onSubmit={handleSubmit} style={{ width: "50%" }}>
          <h2>Add Inventory</h2>
          <div className="mb-2">
            <label htmlFor="ProductName"></label>
            <input
              type="text"
              name="product_name"
              placeholder="Enter Product_name"
              className="form-control"
              onChange={handleInputChange}
            />
            {errors.product_name && (
              <span className="text-danger">{errors.product_name}</span>
            )}
          </div>
          <div className="mb-2">
            <label htmlFor="Address"></label>
            <input
              type="text"
              name="category"
              placeholder="Enter Category"
              className="form-control"
              onChange={handleInputChange}
            />
            {errors.category && (
              <span className="text-danger">{errors.category}</span>
            )}
          </div>
          <div className="mb-2">
            <label htmlFor="Name"></label>
            <input
              type="text"
              name="price"
              placeholder="Enter Price"
              className="form-control"
              onChange={handleInputChange}
            />
            {errors.price && (
              <span className="text-danger">{errors.price}</span>
            )}
          </div>
          <div className="mb-2">
            <label htmlFor="Name"></label>
            <input
              type="text"
              name="quantity"
              placeholder="Enter Quantity"
              className="form-control"
              onChange={handleInputChange}
            />
            {errors.quantity && (
              <span className="text-danger">{errors.quantity}</span>
            )}
          </div>
          <div className="mb-2">
            <label htmlFor="Name"></label>
            <input
              type="text"
              name="total_amount"
              placeholder="Enter Amount"
              className="form-control"
              value={values.total_amount}
              readOnly
            />
          </div>
          <div className="mb-2">
            <label htmlFor="Team"></label>
            <input
              type="text"
              name="team"
              placeholder="enter team_name"
              className="form-control"
              value={values.team_id}
              readOnly
            />
          </div>
          <br />
          <div className="d-flex justify-content-between align-items-center">
            <input type="file" onChange={handleFile} />
          </div>
          <br />
          <div className="mt-3">
            <Link to="/" className="btn btn-primary me-2">
              Back
            </Link>
            <button className="btn btn-success">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Create;
