import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import SkeletonLoader from "../Animation/SkeletonLoader";
import fetchFromWooCommerce from "../../utilities/FetchFromWooCommerce";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchReviews = async (page = 1) => {
    // const url = `https://${import.meta.env.VITE_domain}/wp-json/wc/v3/products/reviews?consumer_key=${import.meta.env.VITE_consumerKey}&consumer_secret=${import.meta.env.VITE_consumerSecret}`;
    // setLoading(true);
  

    try {
      const { data, error,headers } = await fetchFromWooCommerce("products/reviews?", {
        per_page: 6,
        page: page,
      });
      if (error) {
        setError("Failed to fetch reviews.");
      } else {
        setReviews(data);
        setTotalPages(Math.ceil(headers['x-wp-totalpages'])); // Fetch the total pages from headers
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError("Failed to fetch reviews.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) return <SkeletonLoader />;

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-4">Product Reviews</h2>
      {reviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <motion.div
              key={review.id}
              className="border p-6 rounded-lg text-white bg-black shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center mb-3">
                <img
                  src={review.reviewer_avatar_urls[96]}
                  alt={review.reviewer}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold">{review.reviewer}</h4>
                  <p className="text-gray-500 text-sm">
                    {new Date(review.date_created).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <p dangerouslySetInnerHTML={{ __html: review.review }} className="text-gray-700 mb-4" />
              <p className="font-bold text-yellow-500">Rating: {review.rating} ⭐</p>
              {review.verified && <span className="text-green-500">Verified Purchase</span>}
              <div className="mt-4">
                <ProductDetails productId={review.product_id} />
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <p>No reviews available.</p>
      )}
      {/* Pagination Controls */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

// ProductDetails Component for displaying product info
const ProductDetails = ({ productId }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      const url = `https://${
        import.meta.env.VITE_domain
      }/wp-json/wc/v3/products/${productId}?consumer_key=${
        import.meta.env.VITE_consumerKey
      }&consumer_secret=${import.meta.env.VITE_consumerSecret}`;
      try {
        const response = await axios.get(url);
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching product details:", err);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  if (loading) return <div>Loading product...</div>;
  return (
    <div className="flex items-center mt-2">
      <img
        src={product.images[0]?.src}
        alt={product.name}
        className="w-16 h-16 mr-2 rounded"
      />
      <a href={product.permalink} className="text-blue-500 underline">
        {product.name}
      </a>
    </div>
  );
};

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="flex justify-center mt-8 space-x-2">
      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded ${
            page === currentPage
              ? "bg-purple-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

export default Reviews;
