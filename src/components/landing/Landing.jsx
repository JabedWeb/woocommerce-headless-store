import React, { useEffect, useState } from "react";
import BannerSlider from "./BannerSlider";
import Categories from "./Categories";
import FeaturedProducts from "./FeaturedProducts";
import ReviewSection from "../reviews/ReviewSection";
import ContactForm from "./ContactForm";
import fetchFromWooCommerce from "../../utilities/FetchFromWooCommerce";

const Landing = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const fetchProducts = async () => {
            try {
                const { data, error, headers } = await fetchFromWooCommerce("products");

                if (error) {
                    console.log("Failed to fetch products.");
                    
                } else {
                   console.log("Products Data:", data);
                }
            } catch (err) {
                console.error("Error fetching products:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, []);

    if(loading) {
        return <p className="text-center">Loading...</p>
    }
  return (
    <div className="container mx-auto p-6 space-y-20">
      {/* Banner Slider */}
      <BannerSlider />

      {/* Product Categories */}
      <Categories />

      {/* Featured Products */}
      <FeaturedProducts />

      {/* Reviews Section */}
      <ReviewSection productId={123} viewType="single" /> {/* Assuming productId for review */}

      {/* Contact Us Form */}
      <ContactForm />
    </div>
  );
};

export default Landing;
