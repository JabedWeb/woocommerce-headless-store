import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { useCart } from "../cart/CartContext";

const SingleProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [variations, setVariations] = useState([]);
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [selectedAttributes, setSelectedAttributes] = useState({});

  useEffect(() => {
    const fetchProduct = async () => {
      const url = `https://${import.meta.env.VITE_domain}/wp-json/wc/v3/products/${id}?consumer_key=${import.meta.env.VITE_consumerKey}&consumer_secret=${import.meta.env.VITE_consumerSecret}`;

      try {
        const response = await axios.get(url);
        setProduct(response.data);
        setLoading(false);

        // Fetch variations
        if (response.data.variations && response.data.variations.length) {
          const variationPromises = response.data.variations.map(variationId => 
            axios.get(`https://${import.meta.env.VITE_domain}/wp-json/wc/v3/products/${id}/variations/${variationId}?consumer_key=${import.meta.env.VITE_consumerKey}&consumer_secret=${import.meta.env.VITE_consumerSecret}`)
          );
          const variationsResponse = await Promise.all(variationPromises);
          setVariations(variationsResponse.map(v => v.data));
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to fetch product.");
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAttributeChange = (attrName, option) => {
    const updatedAttributes = { ...selectedAttributes, [attrName]: option };
    setSelectedAttributes(updatedAttributes);

    const variation = variations.find(v =>
      v.attributes.every(attr => 
        updatedAttributes[attr.name] === attr.option
      )
    );

    setSelectedVariation(variation);
  };

  const { dispatch } = useCart();

  const handleAddToCart = () => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: { id: product.id, title: product.name, price: product.price },
    });
    alert(`${product.name} has been added to your cart!`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  const currentImage = selectedVariation ? selectedVariation.image.src : product.images[0]?.src;
  const currentPrice = selectedVariation ? selectedVariation.price : product.price;

  // Collect unique attribute names and options
  const attributes = {};
  
  variations.forEach(variation => {
    variation.attributes.forEach(attr => {
      if (!attributes[attr.name]) {
        attributes[attr.name] = new Set(); // Initialize a set for unique options
      }
      attributes[attr.name].add(attr.option); // Add option to the set
    });
  });

  return (
    <div className="container mx-auto p-4">
      <Link to="/checkout" className="text-blue-500">Go TO Checkout</Link>
      <h2 className="text-3xl font-bold mb-4">{product.name}</h2>
      <div className="flex">
        <img src={currentImage} alt={product.name} className="w-1/2" />
        <div className="ml-4 w-1/2">
          <h3 className="text-xl font-bold">Price: {currentPrice || "Contact for price"}</h3>
          <div dangerouslySetInnerHTML={{ __html: product.short_description }} />

          {/* Attribute-Based Variation Selection */}
          {Object.entries(attributes).map(([attrName, options]) => (
            <div key={attrName} className="mt-4">
              <label className="font-semibold">{attrName}:</label>
              <select onChange={(e) => handleAttributeChange(attrName, e.target.value)} defaultValue="">
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
          <button onClick={handleAddToCart}
            className="mt-6 bg-purple-500 text-white px-4 py-2 rounded" 
            disabled={!product.purchasable || !selectedVariation}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
