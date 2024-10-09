import React from "react";
import { FaStar } from "react-icons/fa";

const Rating = ({ rating }) => (
  <div className="flex space-x-1 text-yellow-500">
    {[...Array(5)].map((_, index) => (
      <FaStar key={index} className={index < rating ? "text-yellow-500" : "text-gray-300"} />
    ))}
  </div>
);

export default Rating;
