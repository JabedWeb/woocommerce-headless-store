// BannerSlider.jsx
import React from "react";
import Slider from "react-slick";
import { motion } from "framer-motion";

const BannerSlider = () => {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const banners = [
    { id: 1, img: "https://dobernut.com/wp-content/uploads/2024/09/gang-of-3-dogs-all-stting.webp", text: "New Arrivals" },
    { id: 2, img: "https://dobernut.com/wp-content/uploads/2024/09/gang-of-3-dogs-all-stting.webp", text: "Best Sellers" },
    { id: 3, img: "https://dobernut.com/wp-content/uploads/2024/09/gang-of-3-dogs-all-stting.webp", text: "Limited Edition" },
  ];

  return (
    <Slider {...sliderSettings}>
      {banners.map((banner) => (
        <motion.div key={banner.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="relative">
            <img src={banner.img} alt={banner.text} className="w-full h-96 object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
              <h2 className="text-4xl font-bold text-white">{banner.text}</h2>
            </div>
          </div>
        </motion.div>
      ))}
    </Slider>
  );
};

export default BannerSlider;
