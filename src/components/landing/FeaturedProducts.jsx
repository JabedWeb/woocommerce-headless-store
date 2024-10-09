// FeaturedProducts.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProductCard from "../shop/ProductCard";
import fetchFromWooCommerce from "../../utilities/fetchFromWooCommerce ";

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await fetchFromWooCommerce("products", { per_page: 6 });
      setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  if (loading) return <p>Loading products...</p>;

  return (
    <div className="text-center space-y-8">
      <h2 className="text-3xl font-semibold">Featured Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <motion.div key={product.id} whileHover={{ scale: 1.05 }}>
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedProducts;
