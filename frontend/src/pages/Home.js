import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line, Bar } from "react-chartjs-2";
import "./Home.css";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement } from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement
);


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
  
  const stockTrendsChart = () => {
    const sortedByDate = [...products].sort((a, b) => new Date(a.date) - new Date(b.date));

    // Function to format date as dd-MM-yyyy
    const formatDate = (date) => {
      const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
      return new Date(date).toLocaleDateString('en-GB', options); // 'en-GB' uses dd-MM-yyyy format
    };

    return {
      labels: sortedByDate.map((product) => product.date ? formatDate(product.date) : formatDate(new Date())),
      datasets: [
        {
          label: "Stock Levels",
          data: sortedByDate.map((product) => product.quantity),
          fill: false,
          borderColor: "#36A2EB",
        },
      ],
    };
  };


  const categoryDistribution = () => {
    const categories = products.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + product.quantity;
      return acc;
    }, {});
    return {
      labels: Object.keys(categories),
      datasets: [
        {
          label: "Inventory by Category",
          data: Object.values(categories),
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
        },
      ],
    };
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
      <div className="charts-container">
        <div className="chart">
          <h4>Category-wise Inventory Distribution</h4>
          <Bar data={categoryDistribution()} />
        </div>
        <div className="chart">
          <h4>Stock Trends Over Time</h4>
          <Line data={stockTrendsChart()} />
        </div>

      </div>
    </div>



  );
};

export default Home;
