import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export const Create = () => {
    const [values, setValues] = useState({
        product_name: "",
        category: "",
        price: "",
        quantity: "",
        total_amount: "",
        product_id: null
    });

    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setValues({
            ...values,
            [name]: value,
            total_amount: name === 'price' || name === 'quantity' ? calculateTotalAmount(value) : values.total_amount
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
        const formData = new FormData();
        formData.append("product_name", values.product_name);
        formData.append("category", values.category);
        formData.append("price", values.price);
        formData.append("quantity", values.quantity);
        formData.append("total_amount", values.total_amount);
        formData.append("image", values.image);
        
        axios.post("http://localhost:8082/create", formData)
            .then(res => {
                console.log(res);
                setValues({ ...values, product_id: res.data.productId });
                navigate("/");
            })
            .catch(err => console.log(err));
    };

    const handleFile = (e) => {
        setValues({
            ...values,
            image: e.target.files[0]
        });
        
    };

    return (
        <div className=' bg-light justify-content-center align-items-center'>
            <div className=' bg-white rounded p-3' style={{ textAlign: "center", maxHeight: "calc(64.5vh - 64px)", overflowY: "auto" }}>
                <form className='form' onSubmit={handleSubmit}>
                    <h2>Add Inventory</h2>
                    <div className='mb-2'>
                        <label htmlFor="ProductName"></label>
                        <input type="text" name="product_name" placeholder='Enter Product_name' className='form-control' onChange={handleInputChange} />
                    </div>
                    <div className='mb-2'>
                        <label htmlFor="Address"></label>
                        <input type="text" name="category" placeholder='Enter Category' className='form-control' onChange={handleInputChange} />
                    </div>
                    <div className='mb-2'>
                        <label htmlFor="Name"></label>
                        <input type="text" name="price" placeholder='Enter Price' className='form-control' onChange={handleInputChange} />
                    </div>
                    <div className='mb-2'>
                        <label htmlFor="Name"></label>
                        <input type="text" name="quantity" placeholder='Enter Quantity' className='form-control' onChange={handleInputChange} />
                    </div>
                    <div className='mb-2'>
                        <label htmlFor="Name"></label>
                        <input type="text" name="total_amount" placeholder='Enter Amount' className='form-control' value={values.total_amount} readOnly />
                    </div>
                    <br/>
                    <div className="d-flex justify-content-between align-items-center">
                        <input type="file" onChange={handleFile} />
                    </div>
                    <br />
                    <div className="mt-3">
                        <Link to="/" className="btn btn-primary me-2">Back</Link>
                        <button className='btn btn-success'>Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Create;