// Shop.jsx
import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import SkeletonLoader from "../Animation/SkeletonLoader";
import fetchFromWooCommerce from "../../utilities/fetchFromWooCommerce ";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9; // Number of products to display per page

  useEffect(() => {
    const fetchAllProducts = async () => {
      const allProducts = [];
      let page = 1;
      const perPage = 100; // Set WooCommerce API max per page limit

      try {
        while (true) {
          const { data, error } = await fetchFromWooCommerce("products", {
            per_page: perPage,
            page: page,
          });

          if (error) {
            setError(error);
            break;
          }

          if (data.length === 0) break; // Stop if no more products

          allProducts.push(...data);
          page++; // Increment page for the next fetch
        }

        setProducts(allProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  // Calculate the current products to display
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

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
