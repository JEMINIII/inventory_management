import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
export const Create = () => {
    const [values,setValues] = useState({
        product_name:"",
        category:"",
        price:"",
        quantity:"",
        total_amount:""
    })

    const navigate = useNavigate()
    const handleSubmit = (e) =>{
        e.preventDefault();
        axios.post("http://localhost:8082/create",values)
        .then(res => {
            console.log(res)
            navigate("/")
        })
        .catch(err => console.log(err))
    }

  return (
    <div className='d-flex vh-100 bg-primary justify-content-center align-items-center'>
        <div className='w-50 bg-white rounded p-3'>
            <form onSubmit={handleSubmit}>
                <h2>Add Inventory</h2>
                <div className='mb-2'>
                    <label htmlFor="ProductName"></label>
                    <input type="text" placeholder='Enter Product_name' className='form-control' onChange={e=> setValues({...values,product_name:e.target.value})} />
                </div>
                <div className='mb-2'>
                    <label htmlFor="Address"></label>
                    <input type="text" placeholder='Enter Category' className='form-control'  onChange={e=> setValues({...values,category:e.target.value})} />
                </div>
                <div className='mb-2'>
                    <label htmlFor="Name"></label>
                    <input type="text" placeholder='Enter Price' className='form-control' onChange={e=> setValues({...values,price:e.target.value})} />
                </div>
                <div className='mb-2'>
                    <label htmlFor="Name"></label>
                    <input type="text" placeholder='Enter Quantity' className='form-control' onChange={e=> setValues({...values,quantity:e.target.value})} />
                </div>
                <div className='mb-2'>
                    <label htmlFor="Name"></label>
                    <input type="text" placeholder='Enter Amount' className='form-control' onChange={e=> setValues({...values,total_amount:e.target.value})} />
                </div>
                <br/>
                <button className='btn btn-success'>Submit</button>
            </form>
        </div>
    </div>
  )
}
