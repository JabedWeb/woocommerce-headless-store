// Shop.jsx
import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import SkeletonLoader from "../Animation/SkeletonLoader";
import fetchFromWooCommerce from "../../utilities/FetchFromWooCommerce";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9; // Number of products to display per page
  const [totalPages, setTotalPages] = useState(0); // Track the total number of pages

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data, error,headers } = await fetchFromWooCommerce("products", {
          per_page: productsPerPage,
          page: currentPage,
        });

        if (error) {
          setError("Failed to fetch products.");
        } else {
          setProducts(data);
          const totalCount = parseInt(headers['x-wp-total']); // Total number of products
          setTotalPages(Math.ceil(totalCount / productsPerPage)); // Calculate total pages
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage]);

  // Change page number on button click
  const changePage = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="text-center">
        Loading products...
        <SkeletonLoader />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold text-center mb-6">Shop</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-y-7">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      {/* Pagination Controls */}
      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => changePage(index + 1)}
            className={`px-4 py-2 rounded ${currentPage === index + 1 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-black'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Shop;
