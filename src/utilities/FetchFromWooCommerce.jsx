// src/utils/api.js
import axios from 'axios';

const fetchFromWooCommerce = async (endpoint, params = {}) => {
  // Check for credentials from environment variables or localStorage
  const domain = import.meta.env.VITE_domain || localStorage.getItem("wooDomain");
  const consumerKey = import.meta.env.VITE_consumerKey || localStorage.getItem("wooConsumerKey");
  const consumerSecret = import.meta.env.VITE_consumerSecret || localStorage.getItem("wooConsumerSecret");

  if (!domain || !consumerKey || !consumerSecret) {
    console.error("WooCommerce credentials are missing.");
    return { data: null, error: "WooCommerce credentials are missing." };
  }

  const baseUrl = `https://${domain}/wp-json/wc/v3/${endpoint}`;

  try {
    const response = await axios.get(baseUrl, {
      params: {
        consumer_key: consumerKey,
        consumer_secret: consumerSecret,
        ...params, // Additional params passed by the component
      },
    });
    return { data: response.data, error: null, headers: response.headers };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { data: null, error: "Failed to fetch data." };
  }
};

export default fetchFromWooCommerce;
