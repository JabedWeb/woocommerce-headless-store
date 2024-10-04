// ProductCard.jsx
import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <div className="card bg-base-100 w-96 shadow-2xl">
      <figure>
        <img src={product.images[0]?.src} alt="Shoes" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">
          {product.name}
          <div className="badge badge-secondary">NEW</div>
        </h2>
        <p>If a dog chews shoes whose shoes does he choose?</p>
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
        
        <Link to={`/product/${product.id}`} className="btn btn-primary">
          View Product
        </Link>
        
        
      </div>
    </div>
  );
};

export default ProductCard;
