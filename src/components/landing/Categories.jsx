// Categories.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import fetchFromWooCommerce from "../../utilities/fetchFromWooCommerce ";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await fetchFromWooCommerce("products/categories");
      setCategories(data);
      setLoading(false);
    };
    fetchCategories();
  }, []);

  if (loading) return <p>Loading categories...</p>;

  return (
    <div className="text-center space-y-8">
      <h2 className="text-3xl font-semibold">Product Categories</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {categories.map((category) => (
          <motion.div 
            key={category.id} 
            className="p-6 bg-gray-800 rounded-lg text-white"
            whileHover={{ scale: 1.05 }}
          >
            <img src={category.image?.src} alt={category.name} className="w-full h-24 object-cover mb-2 rounded-lg" />
            <h3 className="text-lg font-semibold">{category.name}</h3>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
