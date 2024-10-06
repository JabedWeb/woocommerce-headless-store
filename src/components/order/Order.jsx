import React, { useState, useEffect } from "react";
import axios from "axios";
import SkeletonLoader from "../Animation/SkeletonLoader";
import Ball from "../Animation/Ball";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 20; // Number of orders to display per page
  const [selectedOrder, setSelectedOrder] = useState(null); // State for selected order

  useEffect(() => {
    const fetchAllOrders = async () => {
      const baseUrl = `https://${
        import.meta.env.VITE_domain
      }/wp-json/wc/v3/orders`;
      const allOrders = [];
      let page = 1;
      const perPage = 100; // Max number of orders per request

      try {
        while (true) {
          const response = await axios.get(baseUrl, {
            params: {
              consumer_key: import.meta.env.VITE_consumerKey,
              consumer_secret: import.meta.env.VITE_consumerSecret,
              per_page: perPage,
              page: page,
            },
          });

          if (response.data.length === 0) break; // Exit if no more orders

          allOrders.push(...response.data); // Add orders to the array
          page++; // Increment page number
        }
        allOrders.sort(
          (a, b) => new Date(b.date_created) - new Date(a.date_created)
        );
        setOrders(allOrders);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllOrders();
  }, []);

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  // Pagination controls
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseDetails = () => {
    setSelectedOrder(null);
  };

  if (loading) {
    return (
      <div className="text-center">
        <Ball />
        Loading orders...
        <SkeletonLoader />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>; // Display error message
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold text-center mb-6">
        Orders - {orders.length}
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border table table-xs border-gray-300">
          <thead>
            <tr>
              <th className="border-b px-4 py-2">Order ID</th>
              <th className="border-b px-4 py-2">Customer</th>
              <th className="border-b px-4 py-2">Date</th>
              <th className="border-b px-4 py-2">Total</th>
              <th className="border-b px-4 py-2">Status</th>
              <th className="border-b px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order) => (
              <tr key={order.id}>
                <td className="border-b px-4 py-2">{order.id}</td>
                <td className="border-b px-4 py-2">
                  {order.billing.first_name} {order.billing.last_name}
                </td>
                <td className="border-b px-4 py-2">
                  {new Date(order.date_created).toLocaleDateString("en-US", {
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </td>
                <td className="border-b px-4 py-2">${order.total}</td>
                <td className="border-b px-4 py-2">{order.status}</td>
                <td className="border-b px-4 py-2">
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                    onClick={() => handleViewDetails(order)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between mt-6">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="bg-purple-500 text-white px-4 py-2 rounded"
        >
          Previous
        </button>
        <span>{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className="bg-purple-500 text-white px-4 py-2 rounded"
        >
          Next
        </button>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-purple-500 text-black  rounded shadow-lg p-4 max-w-lg w-full">
            <h3 className="text-lg font-bold mb-4">
              Order Details (ID: {selectedOrder.id})
            </h3>

            <h4 className="font-semibold">Products:</h4>
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full table table-sm bg-white rounded shadow">
                <thead>
                  <tr className="bg-purple-600 text-white">
                    <th className="border-b px-4 py-2">Product Name</th>
                    <th className="border-b px-4 py-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.line_items.map((item) => (
                    <tr key={item.id}>
                      <td className="border-b px-4 py-2">{item.name}</td>
                      <td className="border-b px-4 py-2">${item.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={handleCloseDetails}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;
