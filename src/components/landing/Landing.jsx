import React from "react";
import BannerSlider from "./BannerSlider";
import Categories from "./Categories";
import FeaturedProducts from "./FeaturedProducts";
import ReviewSection from "../reviews/ReviewSection";
import ContactForm from "./ContactForm";

const Landing = () => {
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
