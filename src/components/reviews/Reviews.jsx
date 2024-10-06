// Reviews.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, useAnimation } from "framer-motion";
import SkeletonLoader from "../Animation/SkeletonLoader";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const controls = useAnimation();

  useEffect(() => {
    const fetchReviews = async () => {
      const url = `https://${import.meta.env.VITE_domain}/wp-json/wc/v3/products/reviews?consumer_key=${import.meta.env.VITE_consumerKey}&consumer_secret=${import.meta.env.VITE_consumerSecret}`;

      try {
        const response = await axios.get(url, {
          params: {
            page : 1,
            per_page: 100,
          },
        });
        setReviews(response.data);
        setLoading(false);
        controls.start({ opacity: 1, y: 0 });
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError("Failed to fetch reviews.");
        setLoading(false);
      }
    };

    fetchReviews();
  }, [controls]);

  if (loading) return <SkeletonLoader />;

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-4">Product Reviews {reviews.length}</h2>
      {reviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review,index) => (
            <motion.div
              key={review.id}
              className="border p-4 rounded-lg shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={controls}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center mb-2">
                <img
                  src={review.reviewer_avatar_urls[96]}
                  alt={review.reviewer}
                  className="w-12 h-12 rounded-full mr-2"
                />
                <div>
                  <h4 className="font-semibold">{review.reviewer}-{index+1}</h4>
                  <p className="text-gray-500">{new Date(review.date_created).toLocaleDateString()}</p>
                </div>
              </div>
              <p className="mb-2">{review.review}</p>
              <p className="font-bold">Rating: {review.rating} ⭐</p>
              {review.verified && <span className="text-green-500">Verified Purchase</span>}
              <div className="mt-4">
                <h5 className="font-semibold">Purchased Product:</h5>
                <ProductDetails productId={review.product_id} />
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <p>No reviews available.</p>
      )}
    </div>

  );
};

// New component to fetch and display product details
const ProductDetails = ({ productId }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setError("Failed to fetch product details.");
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) return <div>Loading product...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

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

export default Reviews;
