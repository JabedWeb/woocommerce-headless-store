// Shop.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9; // Number of products to display per page
  console.log(import.meta.env.VITE_consumerKey);
  
  

  useEffect(() => {
    const fetchAllProducts = async () => {
      const baseUrl = `https://${import.meta.env.VITE_domain}/wp-json/wc/v3/products`;
      const allProducts = [];
      let page = 1;
      const perPage = 100; // Max number of products per request

      try {
        while (true) {
          const response = await axios.get(baseUrl, {
            params: {
              consumer_key: import.meta.env.VITE_consumerKey,
              consumer_secret: import.meta.env.VITE_consumerSecret,
              per_page: perPage,
              page: page,
            },
          });

          if (response.data.length === 0) break; // Exit if no more products

          allProducts.push(...response.data); // Add products to the array
          page++; // Increment page number
        }

        setProducts(allProducts); // Set state with all products
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to fetch products."); // Set error message
      } finally {
        setLoading(false); // End loading state
      }
    };

    fetchAllProducts(); // Call the function
  }, []);

  // Calculate the current products to display
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);


  console.log('currentProducts', currentProducts);
  

  // Calculate total pages
  const totalPages = Math.ceil(products.length / productsPerPage);

  // Pagination controls
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) {
    return <div className="text-center">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>; // Display error message
  }

  return (
    <div className="container mx-auto p-4">
      <h3 className="text-purple-300 font-bold text-5xl">{products.length}</h3>
      <h2 className="text-2xl font-bold text-center mb-6">Shop</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-y-6">
        {currentProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      {/* Pagination Controls */}
      <div className="flex justify-between mt-6">
        <button onClick={prevPage} disabled={currentPage === 1} className="bg-purple-500 text-white px-4 py-2 rounded">
          Previous
        </button>
        <span>{`Page ${currentPage} of ${totalPages}`}</span>
        <button onClick={nextPage} disabled={currentPage === totalPages} className="bg-purple-500 text-white px-4 py-2 rounded">
          Next
        </button>
      </div>
    </div>
  );
};

export default Shop;
