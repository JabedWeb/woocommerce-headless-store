// src/utils/api.js
import axios from 'axios';

const fetchFromWooCommerce = async (endpoint, params = {}) => {
  const baseUrl = `https://${import.meta.env.VITE_domain}/wp-json/wc/v3/${endpoint}`;
  try {
    const response = await axios.get(baseUrl, {
      params: {
        consumer_key: import.meta.env.VITE_consumerKey,
        consumer_secret: import.meta.env.VITE_consumerSecret,
        ...params, // Additional params passed by the component
      },
    });
    return { data: response.data, error: null };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { data: null, error: "Failed to fetch data." };
  }
};

export default fetchFromWooCommerce;
