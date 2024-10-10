// src/components/WooCommerceSetup.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const WooCommerceSetup = () => {
  const [domain, setDomain] = useState('');
  const [consumerKey, setConsumerKey] = useState('');
  const [consumerSecret, setConsumerSecret] = useState('');
  const navigate=useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Save to localStorage
    localStorage.setItem("wooDomain", domain);
    localStorage.setItem("wooConsumerKey", consumerKey);
    localStorage.setItem("wooConsumerSecret", consumerSecret);
    if(domain && consumerKey && consumerSecret){
      navigate('/');
    }
  };

  return (
    <div className="setup-container p-3 container mx-auto">
      <h2>WooCommerce Setup</h2>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input
          type="text"
          placeholder="WooCommerce Site Domain (e.g., example.com) not including https://"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          required
          className="p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          placeholder="Consumer Key"
          value={consumerKey}
          onChange={(e) => setConsumerKey(e.target.value)}
          required
          className="p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          placeholder="Consumer Secret"
          value={consumerSecret}
          onChange={(e) => setConsumerSecret(e.target.value)}
          required
          className="p-2 border border-gray-300 rounded"
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">
          Save Settings
        </button>
      </form>
    </div>
  );
};

export default WooCommerceSetup;
