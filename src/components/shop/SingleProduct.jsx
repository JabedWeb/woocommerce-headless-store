import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import fetchFromWooCommerce from "../../utilities/fetchFromWooCommerce ";
import ReviewSection from "../reviews/ReviewSection";
import { useCart } from "../cart/CartContext";

const SingleProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [variations, setVariations] = useState([]);
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { handleAddToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);

      const { data: productData, error: productError } = await fetchFromWooCommerce(`products/${id}`);
      if (productError) {
        setError(productError);
        setLoading(false);
        return;
      }
      setProduct(productData);

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

  const addToCart = () => {
    const cartItem = {
      id: product.id,
      title: product.name,
      price: selectedVariation ? selectedVariation.price : product.price,
      variation: selectedVariation ? selectedVariation.name : null,
    };
    handleAddToCart(cartItem, 1); 
    alert(`${product.name} has been added to your cart!`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  const currentImage = selectedVariation ? selectedVariation.image.src : product.images[0]?.src;
  const currentPrice = selectedVariation ? selectedVariation.price : product.price;

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
    <div className="container mx-auto p-6 space-y-8">
      <Link to="/checkout" className="text-blue-500 hover:text-blue-700">Go To Checkout</Link>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/2 flex justify-center items-center">
          <img src={currentImage} alt={product.name} className="w-full rounded-lg shadow-lg" />
        </div>

        <div className="lg:w-1/2 space-y-4">
          <h2 className="text-4xl font-bold ">{product.name}</h2>
          <p className="text-lg text-gray-600" dangerouslySetInnerHTML={{ __html: product.short_description }} />
          <p className="text-2xl font-bold text-indigo-600">Price: ${currentPrice || "Contact for price"}</p>

          <div className="flex items-center gap-4">
            <p className="text-lg">Stock Status:</p>
            <p className={`${product.stock_status === 'instock' ? 'text-green-500' : 'text-red-500'} font-semibold`}>
              {product.stock_status === 'instock' ? 'In Stock' : 'Out of Stock'}
            </p>
          </div>

          <div className="space-y-4">
            {Object.entries(attributes).map(([attrName, options]) => (
              <div key={attrName} className="space-y-2">
                <label className="font-semibold">{attrName}:</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded"
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
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={addToCart}
            className="w-full mt-6 bg-purple-600 text-white py-3 rounded-lg shadow hover:bg-purple-700 transition duration-300"
            disabled={!product.purchasable || (product.variations.length > 0 && !selectedVariation)}
          >
            Add to Cart
          </motion.button>
        </div>
      </div>

      {/* Integrate the Review Section */}
      <ReviewSection productId={product.id} />
    </div>
  );
};

export default SingleProduct;
