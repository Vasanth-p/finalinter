import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Home.css";


const Home = () => {
  const [products, setProducts] = useState([]); // To hold the list of products

  const [product, setProduct] = useState({
    name: '',
    category: '',
    price: '',
    quantity: '',
  });
  const [categoryOptions, setCategoryOptions] = useState([]); // New state for category options

  const [searchTerm, setSearchTerm] = useState(""); // State to hold the search term
  const [showAddModal, setShowAddModal] = useState(false); // To manage Add Product modal visibility
  const [showEditModal, setShowEditModal] = useState(false); // To manage Edit Product modal visibility
  const [editProduct, setEditProduct] = useState(null); // To store the product that is being edited
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
  }); // To store form data for adding a new product
  const productCategories = {
    Threads: [
      "Abrasion Resistance", "Anti-fungal", "Anti-microbial", "Anti-static", "Anti-wick",
      "Bleach Fast", "Bobbins", "Bonded", "Braided", "Button secure", "Chemical Resistance",
      "Cotton", "Cut-proof", "Double stretch", "Excellent Strength and Durability", "Fine Tailored",
      "Finer ticket size", "Flame Resistant", "Flame Retardant", "Fusible", "Glace", "Glace Finish",
      "Glow in the dark", "Heavily Waxed", "Heavy Duty", "High Extension", "High Sheen", "High Strength",
      "High Tenacity", "Higher Tenacity and Elongation", "Highly Abrasion Resistance", "Hydrolysis Resistance",
      "Indigo Dyed", "Lightly Waxed", "Lower Dynamic Frictional Values", "Mercerised", "Metallic", "Multicolour",
      "Natural Cotton Cover", "Optimal softness", "Over-dye", "PFC Free", "Recycled", "Reflective", "Retro-reflective",
      "Self-locking", "Sewability", "Silicone Free", "Smooth", "Soft", "Soft finish", "Softness", "Special core spinning",
      "Stretch Seams", "Superior Strength", "Sustainable", "Sutures", "Thermoplastic", "Thicker Cotton Cover",
      "UV Resistant", "Unbleached", "Water Repellent", "Water Repellent PFC Free", "Waxed"
    ],
    Yarns: [
      "Admiral", "Aptan", "Armoren", "Astra", "CoatsKnit", "Dabond", "FlamePro", "Gotex", 
      "Gral", "Prolene", "Protos", "RecLID Teabag", "Stricose FH", "Ultrabloc", "Webflex", "XTRU"
    ],
    // Define other products similarly (Zips, Composites, etc.)
    Zips: [
      "Coats M", "Coats P", "Coats Pullers", "Coats RT", "Coats S"
    ],
    Composites: [
      "Gotex", "Lattice", "Protos", "Synergex"
    ],
    StructuralComponents: [
        "Classic", "Leisure", "Outdoor", "Performance Shoes", "Running Shoes", "Sports", 
        "Sports Shoes", "Work & Safety"
    ],
    Insoles: 
    [
      "No Product Available"
    ] ,
    Fabric: 
    [
      "FlamePro"
    ],
    Trims: [
      "Hook and Loop", "Interlining", "Reflective Tape"
    ]
    // Continue adding other products' categories...
  };


  const handleProductChange = (e) => {
    const selectedProduct = e.target.value; // Get the selected product
  
    // Update the newProduct state with selected product and reset category
    setNewProduct((prev) => ({
      ...prev,
      name: selectedProduct,
      category: "", // Reset category when changing product type
    }));
  
    // Update the category options based on the selected product
    setCategoryOptions(productCategories[selectedProduct] || []); // Get categories for selected product
  };
  

  const [criticalStockProducts, setCriticalStockProducts] = useState([]); // Declare state for critical stock products\

  const LOW_STOCK_THRESHOLD = 5; // Threshold for low stock items
  const OVERSTOCK_THRESHOLD = 40; // Define threshold for overstocked items



  // Fetch products from the API
  const fetchProducts = () => {
    axios
      .get("http://localhost:5000/api/products")
      .then((res) => {

        const allProducts = res.data;
        // Adjust prices based on stock levels
        allProducts.forEach((product) => {
          if (product.quantity <= LOW_STOCK_THRESHOLD) {
            product.price = product.price * 1.10; // Increase price for low stock
          } else if (product.quantity >= OVERSTOCK_THRESHOLD) {
            product.price = product.price * 0.90;// Decrease price for overstock
          }
        });
        setProducts(allProducts); // Update products with adjusted prices

        const critical = allProducts.filter(
          (product) => product.quantity < LOW_STOCK_THRESHOLD
        );
        setCriticalStockProducts(critical); // Update critical stock state
      })
      .catch((err) => console.error("Error fetching products:", err));
  };

  useEffect(() => {
    fetchProducts();
  }, []);


  useEffect(() => {
    console.log(categoryOptions); // Logs category options to check if they update
  }, [categoryOptions]);


  // Add a new product
  const handleAddProduct = () => {
    axios
      .post("http://localhost:5000/api/products", newProduct) // API endpoint for adding a product
      .then(() => {
        alert("Product added successfully!");
        setShowAddModal(false); // Close the modal
        fetchProducts(); // Refresh the product list
        setNewProduct({ name: "", category: "", price: "", quantity: "" }); // Reset form fields
      })
      .catch((err) => console.error("Error adding product:", err));
  };

  // Handle changes in the add product form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  // Delete a product
  const deleteProduct = (id) => {
    axios
      .delete(`http://localhost:5000/api/products/${id}`) // API endpoint for deletion
      .then(() => {
        alert("Product deleted successfully!");
        fetchProducts(); // Refresh the product list
      })
      .catch((err) => console.error("Error deleting product:", err));
  };

  // Trigger edit modal with the selected product
  const handleEdit = (product) => {
    setEditProduct(product);
    setShowEditModal(true);
  };

  // Handle product update (edit)
  const handleUpdateProduct = () => {
    axios
      .put(`http://localhost:5000/api/products/${editProduct._id}`, editProduct)
      .then(() => {
        alert("Product updated successfully!");
        fetchProducts(); // Refresh the product list
        setShowEditModal(false); // Close edit modal
      })
      .catch((err) => console.error("Error updating product:", err));
  };

  // Handle changes in the edit form fields
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditProduct((prev) => ({ ...prev, [name]: value }));
  };

  // Handle changes in the search input field
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Fetch products when the component mounts
  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products based on the search term
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // Calculate the total inventory value
  const calculateTotalValue = () => {
    return products.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );
  };
  return (

    <div className="home-container">


      {/* Notification Banner */}
      {criticalStockProducts.length > 0 && (
        <div className="critical-stock-banner">
          <p>
            <strong>Warning!</strong> The following products have critically low
            stock levels:
          </p>
          <ul>
            {criticalStockProducts.map((product) => (
              <li key={product._id}>
                {product.name} (Only {product.quantity} left)
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Header Section */}
      <div className="header">
        <h1>Inventory Management</h1>
        <div className="breadcrumb">
          <span>Dashboard</span> / <span>Products</span>
        </div>
      </div>
      <div className="total-inventory-value">
        <div className="total-item-box total-value">
          <span>Total Inventory Value</span>
          <span className="value">₹{calculateTotalValue().toFixed(2)}</span>
        </div>

        <div className="total-item-box total-stock">
          <span>Total Stock</span>
          <span className="value">
            {products.reduce((total, product) => total + product.quantity, 0)}
          </span>
        </div>

        <div className={`total-item-box out-of-stock ${criticalStockProducts.length === 0 ? 'no-out-of-stock' : criticalStockProducts.length > 1 ? 'multiple-out-of-stock' : ''}`}>
          <span>Out of Stock</span>
          <span className="value">
            {criticalStockProducts.length > 0 ? (
              <span>{criticalStockProducts.length}</span>
            ) : (
              <span>No products with critical stock.</span>
            )}
          </span>
        </div>
      </div>



      {/* Actions Section */}
      <div className="actions">
        <input
          type="text"
          className="search-box"
          placeholder="Search Product"
          value={searchTerm}
          onChange={handleSearchChange} // Handle search input changes
          style={{ width: '85%'}}
        />
        <button
          className="add-product-btn"
          onClick={() => setShowAddModal(true)}
        >
          Add Product
        </button>
      </div>


      {/* Products Table */}
      <table className="product-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <tr
                key={product._id}
                className={
                  product.quantity < LOW_STOCK_THRESHOLD ? "low-stock" : ""
                } // Apply low-stock class
              >
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>₹{product.price.toFixed(2)}</td> {/* Show adjusted price */}
                <td>{product.quantity}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(product)}>Edit</button>
                  <button
                    className="delete-btn"
                    onClick={() => deleteProduct(product._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="no-data">
                No products available.
              </td>
            </tr>
          )}
        </tbody>
      </table>


      {/* Add Product Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Add New Product</h2>
            <form>
              <label>Name:</label>
              <select
                name="name"
                value={newProduct.name}
                onChange={handleProductChange}
                required
              >
                <option value="">Select Product</option>
                <option value="Threads">Threads</option>
                <option value="Yarns">Yarns</option>
                <option value="Zips">Zips</option>
                <option value="Composites">Composites</option>
                <option value="StructuralComponents">Structural Components</option>
                <option value="Insoles">Insoles</option>
                <option value="Fabrics">Fabrics</option>
                <option value="Trims">Trims</option>
              </select>

              <label>Category:</label>
              <select
                name="category"
                value={newProduct.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Category</option>
                {/* Dynamically populate categories based on selected product */}
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <label>Price:</label>
              <input
                type="number"
                name="price"
                value={newProduct.price}
                onChange={handleInputChange}
                required
              />
              <label>Quantity:</label>
              <input
                type="number"
                name="quantity"
                value={newProduct.quantity}
                onChange={handleInputChange}
                required
              />
              <div className="modal-actions">
                <button type="button" onClick={handleAddProduct}>
                  Add
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Edit Product</h2>
            <form>
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={editProduct.name}
                onChange={handleEditInputChange}
                required
              />
              <label>Category:</label>
              <input
                type="text"
                name="category"
                value={editProduct.category}
                onChange={handleEditInputChange}
                required
              />
              <label>Price:</label>
              <input
                type="number"
                name="price"
                value={editProduct.price}
                onChange={handleEditInputChange}
                required
              />
              <label>Quantity:</label>
              <input
                type="number"
                name="quantity"
                value={editProduct.quantity}
                onChange={handleEditInputChange}
                required
              />
              <div className="modal-actions">
                <button type="button" onClick={handleUpdateProduct}>
                  Save Changes
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>



  );
};

export default Home;
