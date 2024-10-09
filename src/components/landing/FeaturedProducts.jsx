// FeaturedProducts.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProductCard from "../shop/ProductCard";
import fetchFromWooCommerce from "../../utilities/FetchFromWooCommerce";

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        
        const { data, error } = await fetchFromWooCommerce("products",{
            per_page: 6,
        });
        if (error) {
          console.log("Failed to fetch products.");
          
        } else {
          console.log("Products Data:", data);
          setProducts(data);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <p>Loading products...</p>;

  return (
    <div className="text-center space-y-8">
     {
        products && products.length > 0 && (
            <h2 className="text-3xl font-semibold">Featured Products</h2>
            )
     }
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
