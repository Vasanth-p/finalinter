import React, { useState } from 'react';
import axios from 'axios';

const AddProduct = ({ refreshProducts }) => {
  const [product, setProduct] = useState({
    name: '',
    category: '',
    price: '',
    quantity: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };
  const productNames = [
    'Threads', 'Yarns', 'Zips', 'Composites', 
    'Structural Components', 'Insoles', 'Fabrics', 'Trims'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/products', product)
      .then(() => {
        alert('Product added successfully!');
        setProduct({ name: '', category: '', price: '', quantity: '' });
        refreshProducts(); // Refresh product list after adding
      })
      .catch(err => console.error(err));
  };
  

  return (
    <form onSubmit={handleSubmit}>
        <select 
        name="name" 
        value={product.name} 
        onChange={handleChange} 
        required
      >
        <option value="">Select Product</option>
        {productNames.map((name, index) => (
          <option key={index} value={name}>{name}</option>
        ))}
      </select>
      <input type="text" name="category" placeholder="Category" value={product.category} onChange={handleChange} required />
      <input type="number" name="price" placeholder="Price" value={product.price} onChange={handleChange} required />
      <input type="number" name="quantity" placeholder="Quantity" value={product.quantity} onChange={handleChange} required />
      <button type="submit">Add Product</button>
    </form>
  );
};

export default AddProduct;
