// ProductCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const ProductCard = ({ product }) => {
  return (
    <div className="card bg-base-100 w-96 shadow-2xl">
      <figure>
        <img src={product.images[0]?.src} alt="Shoes" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">
          {product.name}
          <div className="badge badge-secondary">{product.featured ? "FEATURED" : "NEW"}</div>
        </h2>
        <div className="card-actions justify-end">
          <div className="badge badge-outline">
            {product.categories[0]?.name}
          </div>
          <div className="badge badge-outline">
            {product.categories[1]
              ? product.categories[1]?.name
              : product.categories[0]?.name}
          </div>
          <div className="badge badge-outline">{product.type}</div>
        </div>
      
        <motion.button
          whileHover={{ scale: 1.1 }}
          className="btn btn-primary mt-4"
        >
          <Link to={`/product/${product.id}`}>View Product</Link>
        </motion.button>

        
        
      </div>
    </div>
  );
};

export default ProductCard;
