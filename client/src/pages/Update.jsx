import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const Update = () => {
  const { id } = useParams();
  console.log(id)
  const [values, setValues] = useState({
        product_name:"",
        category:"",
        price:"",
        quantity:"",
        total_amount:""
  });

  useEffect(() => {
    axios.get("http://localhost:8082/products/read/" + id)
      .then(res => {
        console.log(res.data.product);
        setValues(prevValues => ({
          ...prevValues,
          product_name:res.data.product.product_name,
          category:res.data.product.category,
          price:res.data.product.price,
          quantity:res.data.product.quantity,
          total_amount:res.data.product.total_amount
        }));
      })
      .catch(err => console.log(err));
  }, [id]);

  const handleUpdate = (e) => {
    e.preventDefault();
    axios.put("http://localhost:8082/products/edit/" + id, values)
      .then(res => {
        console.log(res.data.product);
        window.location.href = "/";
      })
      .catch(err => console.log(err));
  };

  return (
    <div className=' bg-light justify-content-center align-items-center'>
            <div className=' bg-white rounded p-3' style={{ textAlign: "center", maxHeight: "calc(85vh - 25px)",
          height: "calc(100vh - 64px)", overflowY: "auto" }}>
        <form onSubmit={handleUpdate}>
          <h2>Update Inventory</h2>
          <div className='mb-2'>
            <label htmlFor="ProductName"></label>
            <input type="text" placeholder='Enter Product_name' className='form-control' onChange={e=> setValues({...values,product_name:e.target.value})} value={values.product_name}/>
          </div>
          <div className='mb-2'>
            <label htmlFor="Address"></label>
            <input type="text" placeholder='Enter Category' className='form-control'  onChange={e=> setValues({...values,category:e.target.value})} value={values.category}/>
          </div>
          <div className='mb-2'>
            <label htmlFor="Name"></label>
            <input type="text" placeholder='Enter Price' className='form-control' onChange={e=> setValues({...values,price:e.target.value})} value={values.price}/>
          </div>
          <div className='mb-2'>
            <label htmlFor="Name"></label>
            <input type="text" placeholder='Enter Quantity' className='form-control' onChange={e=> setValues({...values,quantity:e.target.value})} value={values.quantity}/>
          </div>
          <div className='mb-2'>
            <label htmlFor="Name"></label>
            <input type="text" placeholder='Enter Amount' className='form-control' onChange={e=> setValues({...values,total_amount:e.target.value})} value={values.total_amount}/>
          </div>
          <div className="mt-3">
            <Link to="/" className="btn btn-primary me-2">Back</Link>
            <button type="submit" className='btn btn-success'>Update</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Update;
