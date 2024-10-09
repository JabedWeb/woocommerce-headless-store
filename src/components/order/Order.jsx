import { useState, useEffect } from "react";
import SkeletonLoader from "../Animation/SkeletonLoader";
import Ball from "../Animation/Ball";
import fetchFromWooCommerce from "../../utilities/FetchFromWooCommerce";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 20;
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0); // Track total orders
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async (page) => {
    setLoading(true);
    setError(null);

    try {
      const { data, headers } = await fetchFromWooCommerce("orders", {
        per_page: ordersPerPage,
        page: page,
      });

      if (!data || data.length === 0) {
        console.warn("No orders found for the current page.");
        setOrders([]);
        return;
      }

      setOrders(data);

      const totalOrdersCount = headers?.["x-wp-total"];
      if (totalOrdersCount) {
        setTotalOrders(parseInt(totalOrdersCount, 10));
        setTotalPages(Math.ceil(totalOrdersCount / ordersPerPage));
      } else {
        setTotalPages(1);  // Fallback in case headers are missing
        setTotalOrders(0);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseDetails = () => {
    setSelectedOrder(null);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const startOrder = (currentPage - 1) * ordersPerPage + 1;
  const endOrder = Math.min(currentPage * ordersPerPage, totalOrders);

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
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold text-center mb-6">
        Orders {startOrder}-{endOrder} of {totalOrders}
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
            {orders.map((order) => (
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
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-purple-500 text-black rounded shadow-lg p-4 max-w-lg w-full">
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

// Add the Pagination component to the same file
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  console.log("Generated Page Numbers:", pageNumbers);
  return (
    <div className="flex flex-wrap gap-2 justify-center mt-6 space-x-2 overflow-x-auto px-4 py-2 bg-gray-100 rounded">
      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded ${
            page === currentPage
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

export default Order;
