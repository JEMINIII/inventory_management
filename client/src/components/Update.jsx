import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Remove Navigate import
import axios from 'axios';

const Update = () => {
  const { id } = useParams();
  const [values, setValues] = useState({
        product_name:"",
        category:"",
        price:"",
        quantity:"",
        total_amount:""
  });

  useEffect(() => {
    axios.get("http://localhost:8082/read/" + id)
      .then(res => {
        console.log(res.data);
        setValues(prevValues => ({
          ...prevValues,
          product_name:res.data[0].product_name,
          category:res.data[0].category,
          price:res.data[0].price,
          quantity:res.data[0].quantity,
          total_amount:res.data[0].total_amount
        }));
      })
      .catch(err => console.log(err));
  }, [id]);

  const handleUpdate = (e) => {
    e.preventDefault();
    axios.put("http://localhost:8082/edit/" + id, values)
      .then(res => {
        console.log(res.data);
        // window.location.href = "/"; // Use window.location.href for navigation
      })
      .catch(err => console.log(err));
  };

  return (
    <div className='d-flex vh-100 bg-light justify-content-center align-items-center'>
      <div className='w-50 bg-white rounded p-3'>
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
          <button className='btn btn-success'>Update</button>
        </form>
      </div>
    </div>
  );
};

export default Update;
