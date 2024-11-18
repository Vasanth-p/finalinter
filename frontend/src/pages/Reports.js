import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Home.css";

const Home = () => {
  const [products, setProducts] = useState([]); // To hold the list of products
  const [searchTerm, setSearchTerm] = useState(""); // State to hold the search term
  const [LOW_STOCK_THRESHOLD] = useState(5); // Threshold for low stock items

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
          }
        });
        setProducts(allProducts); // Update products with adjusted prices
      })
      .catch((err) => console.error("Error fetching products:", err));
  };

  useEffect(() => {
    fetchProducts(); // Fetch products on component mount
  }, []);

  // Handle changes in the search input field
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter products based on the search term
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Generate CSV report
  const generateInventoryReport = () => {
    const csvContent = [
      ["Name", "Category", "Price", "Quantity", "Total Value"],
      ...products.map((product) => [
        product.name,
        product.category,
        product.price.toFixed(2),
        product.quantity,
        (product.price * product.quantity).toFixed(2),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "inventory_report.csv";
    link.click();
  };

  return (
    <div className="home-container">
      {/* Actions Section */}
      <div className="actions">
        <input
          type="text"
          className="search-box"
          placeholder="Search Product"
          value={searchTerm}
          style={{ width: '78%'}}
          onChange={handleSearchChange} // Handle search input changes
        />
        <button className="generate-report-btn" onClick={generateInventoryReport} >
          Generate Inventory Report
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
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="no-data">
                No products available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Home;
