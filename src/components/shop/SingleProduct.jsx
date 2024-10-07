import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useCart } from "../cart/CartContext";
import { motion } from "framer-motion";
import fetchFromWooCommerce from "../../utilities/fetchFromWooCommerce ";

const SingleProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [variations, setVariations] = useState([]);
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);

      // Fetch the main product data
      const { data: productData, error: productError } = await fetchFromWooCommerce(`products/${id}`);
      if (productError) {
        setError(productError);
        setLoading(false);
        return;
      }
      setProduct(productData);

      // Check for variations if available
      if (productData?.variations?.length) {
        const variationPromises = productData.variations.map(variationId => 
          fetchFromWooCommerce(`products/${id}/variations/${variationId}`)
        );
        
        const variationsResponse = await Promise.all(variationPromises);
        const variationsData = variationsResponse.map(({ data }) => data);
        
        setVariations(variationsData);
      }

      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  const handleAttributeChange = (attrName, option) => {
    const updatedAttributes = { ...selectedAttributes, [attrName]: option };
    setSelectedAttributes(updatedAttributes);

    const variation = variations.find(v =>
      v.attributes.every(attr => updatedAttributes[attr.name] === attr.option)
    );

    setSelectedVariation(variation);
  };

  const { dispatch } = useCart();

  const handleAddToCart = () => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        id: product.id,
        title: product.name,
        price: selectedVariation ? selectedVariation.price : product.price,
      },
    });
    alert(`${product.name} has been added to your cart!`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  const currentImage = selectedVariation ? selectedVariation.image.src : product.images[0]?.src;
  const currentPrice = selectedVariation ? selectedVariation.price : product.price;

  // Gather unique attribute names and options for variations
  const attributes = {};
  variations.forEach(variation => {
    variation.attributes.forEach(attr => {
      if (!attributes[attr.name]) {
        attributes[attr.name] = new Set();
      }
      attributes[attr.name].add(attr.option);
    });
  });

  return (
    <div className="container mx-auto p-4">
      <Link to="/checkout" className="text-blue-500">Go TO Checkout</Link>
      <div className="flex">
        <img src={currentImage} alt={product.name} className="w-1/2" />
        <div className="ml-4 w-1/2">
          <h2 className="text-3xl font-bold mb-4">{product.name}</h2>
          <h3 className="text-xl font-bold">Price: {currentPrice || "Contact for price"}</h3>
          <div dangerouslySetInnerHTML={{ __html: product.short_description }} />

          {/* Attribute-Based Variation Selection */}
          {Object.entries(attributes).map(([attrName, options]) => (
            <div key={attrName} className="mt-4">
              <label className="font-semibold">{attrName}: </label>
              <select
                style={{ width: "300px", height: "40px" }}
                onChange={(e) => handleAttributeChange(attrName, e.target.value)}
                defaultValue=""
              >
                <option value="">Select {attrName}</option>
                {[...options].map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          ))}

          {/* Add to Cart Button */}
          <motion.button
            whileHover={{ scale: 1.2 }}
            onClick={handleAddToCart}
            className="mt-6 bg-purple-500 text-white px-4 py-2 rounded"
            disabled={!product.purchasable || (product.variations.length > 0 && !selectedVariation)}
          >
            Add to Cart
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
