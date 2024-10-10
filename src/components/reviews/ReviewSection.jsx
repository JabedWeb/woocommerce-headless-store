import React, { useState, useEffect } from "react";
import { FaStar, FaCheckCircle } from "react-icons/fa";
import Slider from "react-slick";
import fetchFromWooCommerce from "../../utilities/FetchFromWooCommerce";

const RatingStars = ({ rating }) => (
  <div className="flex items-center space-x-1">
    {[...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        className={`${index < rating ? "text-green-500" : "text-gray-300"}`}
      />
    ))}
  </div>
);

const ReviewSection = ({ productId, viewType = "carousel" }) => {
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
        const filteredReviews = data.filter(
          (review) => review.product_id === productId
        );
        setReviews((prevReviews) => {
          const newReviews = filteredReviews.filter(
            (newReview) =>
              !prevReviews.some((prevReview) => prevReview.id === newReview.id)
          );
          return [...prevReviews, ...newReviews];
        });
        if (data.length === 100) {
          fetchReviews(pageNumber + 1);
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

  if (error) return <p className="text-red-500">{error}</p>;

  if (reviews.length === 0) {
    return <p className="text-gray-500">No reviews available.</p>;
  }

  const averageRating = reviews.length
    ? (
        reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      ).toFixed(1)
    : 0;

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: viewType === "carousel" ? 3 : 1,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: viewType === "carousel" ? 2 : 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div
      className={`mt-12 ${
        viewType === "carousel"
          ? "bg-black text-white p-6 rounded-lg shadow-lg"
          : ""
      }`}
    >
      <div className="flex flex-col items-center mb-8">
        <p className="text-3xl font-semibold">Excellent</p>
        <div className="flex items-center my-2">
          <RatingStars rating={Math.round(averageRating)} />
          <span className="ml-2 text-gray-400 text-lg">
            Based on {reviews.length} reviews
          </span>
        </div>
        <FaCheckCircle className="text-green-500 mt-1" size={24} />
        <h2 className="mt-3 text-2xl text-purple-400 font-bold">
          {reviews[0].product_name}
        </h2>
      </div>

      {reviews.length === 1 ? (
        <div className="p-4">
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-2">
              <RatingStars rating={reviews[0].rating} />
              <span className="text-xs text-green-500 flex items-center">
                <FaCheckCircle className="mr-1" /> Verified
              </span>
            </div>
            <p
              dangerouslySetInnerHTML={{ __html: reviews[0].review }}
              className="font-semibold text-white mb-2"
            />
            <p className="text-gray-400 text-sm mb-1">{reviews[0].reviewer}</p>
            <p className="text-gray-500 text-xs">
              {new Date(reviews[0].date_created).toLocaleDateString()}
            </p>
          </div>
        </div>
      ) : viewType === "carousel" ? (
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
                <p
                  dangerouslySetInnerHTML={{ __html: review.review }}
                  className="font-semibold text-white mb-2"
                />
                <p className="text-gray-400 text-sm mb-1">{review.reviewer}</p>
                <p className="text-gray-500 text-xs">
                  {new Date(review.date_created).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </Slider>
      ) : (
        <div className="device" style={{ maxWidth: "700px" }}>
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
                  <p
                    dangerouslySetInnerHTML={{ __html: review.review }}
                    className="font-semibold text-white mb-2"
                  />
                  <p className="text-gray-400 text-sm mb-1">
                    {review.reviewer}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {new Date(review.date_created).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
