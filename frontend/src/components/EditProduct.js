import React, { useState } from 'react';
import axios from 'axios';

const EditProduct = ({ product, refreshProducts, closeEdit }) => {
  const [updatedProduct, setUpdatedProduct] = useState(product);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProduct({ ...updatedProduct, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`https://finalinter-backend.onrender.com/api/products/${product._id}`, updatedProduct)
      .then(() => {
        alert('Product updated successfully!');
        refreshProducts(); // Refresh product list after updating
        closeEdit(); // Close edit form
      })
      .catch(err => console.error(err));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" value={updatedProduct.name} onChange={handleChange} required />
      <input type="text" name="category" value={updatedProduct.category} onChange={handleChange} required />
      <input type="number" name="price" value={updatedProduct.price} onChange={handleChange} required />
      <input type="number" name="quantity" value={updatedProduct.quantity} onChange={handleChange} required />
      <button type="submit">Save Changes</button>
      <button type="button" onClick={closeEdit}>Cancel</button>
    </form>
  );
};

export default EditProduct;
