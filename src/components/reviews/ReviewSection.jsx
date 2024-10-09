import React, { useState, useEffect } from "react";
import { FaStar, FaCheckCircle } from "react-icons/fa";
import Slider from "react-slick"; // Import Slider component from react-slick
import fetchFromWooCommerce from "../../utilities/fetchFromWooCommerce ";
// import fetchFromWooCommerce from "../../utilities/fetchFromWooCommerce"; // Adjust the path if needed

const RatingStars = ({ rating }) => (
  <div className="flex items-center space-x-1">
    {[...Array(5)].map((_, index) => (
      <FaStar key={index} className={`${index < rating ? 'text-green-500' : 'text-gray-300'}`} />
    ))}
  </div>
);

const ReviewSection = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReviews = async (pageNumber = 1) => {
    try {
      setLoading(true);
      const { data, error } = await fetchFromWooCommerce(
        `products/reviews?per_page=100&page=${pageNumber}`
      );

      if (error) {
        setError("Error fetching reviews");
      } else {
        const filteredReviews = data.filter((review) => review.product_id === productId);
        
        // Prevent duplicates by checking existing review IDs
        setReviews((prevReviews) => {
          const newReviews = filteredReviews.filter(
            (newReview) => !prevReviews.some((prevReview) => prevReview.id === newReview.id)
          );
          return [...prevReviews, ...newReviews];
        });

        // If 100 reviews are fetched, try fetching the next page
        if (data.length === 100) {
          fetchReviews(pageNumber + 1); // Recursive call to fetch next page
        }
      }
    } catch (err) {
      console.error("Failed to load reviews:", err);
      setError("Failed to load reviews.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  if (loading && reviews.length === 0) return <p>Loading reviews...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const averageRating = reviews.length ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1) : 0;

  // Settings for the slider
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  return (
    <div className="mt-12 bg-black text-white p-6 rounded-lg shadow-lg">
      {/* Overall Rating Section */}
      <div className="flex flex-col items-center mb-8">
        <p className="text-3xl font-semibold">Excellent</p>
        <div className="flex items-center my-2">
          <RatingStars rating={Math.round(averageRating)} />
          <span className="ml-2 text-gray-400 text-lg">Based on {reviews.length} reviews</span>
        </div>
        <FaCheckCircle className="text-green-500 mt-1" size={24} />
      </div>

      {/* Carousel for Individual Reviews */}
      <Slider {...sliderSettings} className="md:mx-10 lg:mx-20">
        {reviews.map((review) => (
          <div key={review.id} className="p-4">
            <div className="bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-2">
                <RatingStars rating={review.rating} />
                <span className="text-xs text-green-500 flex items-center">
                  <FaCheckCircle className="mr-1" /> Verified
                </span>
              </div>
              <p dangerouslySetInnerHTML={{__html : review.review}} className="font-semibold text-white mb-2"/>
              <p className="text-gray-400 text-sm mb-1">{review.reviewer}</p>
              <p className="text-gray-500 text-xs">{new Date(review.date_created).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ReviewSection;
