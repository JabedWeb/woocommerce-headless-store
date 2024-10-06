import React, { useState, useEffect } from "react";
import axios from "axios";
import SkeletonLoader from "../Animation/SkeletonLoader";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 10; // Number of customers to display per page
  const [selectedCustomer, setSelectedCustomer] = useState(null); // State for selected customer

  useEffect(() => {
    const fetchAllOrders = async () => {
      const baseUrl = `https://${import.meta.env.VITE_domain}/wp-json/wc/v3/orders`;
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

        // Process orders to extract customer data
        const customerMap = {};
        const twoMonthsAgo = new Date();
        twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

        allOrders.forEach(order => {
          const customerId = order.customer_id || order.billing.email; // Use email as ID if customer_id is not available
          const totalSpent = parseFloat(order.total);

          // Update customer data
          if (!customerMap[customerId]) {
            customerMap[customerId] = {
              id: customerId,
              name: `${order.billing.first_name} ${order.billing.last_name}`,
              totalSpent: 0,
              email: order.billing.email,
              orderCount: 0,
              orders: [],
            };
          }
          customerMap[customerId].totalSpent += totalSpent;
          customerMap[customerId].orderCount += 1;
          customerMap[customerId].orders.push({
            id: order.id,
            date: order.date_created,
            total: totalSpent,
          });
        });

        const customerArray = Object.values(customerMap);
        setCustomers(customerArray); // Set state with all customers

        // Calculate top 10 clients for the last 2 months
        const topClientsLastTwoMonths = customerArray
          .filter(customer =>
            customer.orders.some(order => new Date(order.date) >= twoMonthsAgo)
          )
          .sort((a, b) => b.totalSpent - a.totalSpent)
          .slice(0, 10);

        // Calculate top 10 clients of all time
        const topClientsAllTime = customerArray
          .sort((a, b) => b.totalSpent - a.totalSpent)
          .slice(0, 10);

        setTopClients({
          lastTwoMonths: topClientsLastTwoMonths,
          allTime: topClientsAllTime,
        });
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to fetch orders."); 
      } finally {
        setLoading(false);
      }
    };

    fetchAllOrders();
  }, []);

  const [topClients, setTopClients] = useState({
    lastTwoMonths: [],
    allTime: [],
  });

  // Pagination logic for the main customer list
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = customers.slice(indexOfFirstCustomer, indexOfLastCustomer);
  const totalPages = Math.ceil(customers.length / customersPerPage);

  const handleViewDetails = (customer) => {
    setSelectedCustomer(customer);
  };

  const handleCloseDetails = () => {
    setSelectedCustomer(null);
  };

  if (loading) {
    return (
      <div className="text-center">
        Loading customers... <SkeletonLoader />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>; // Display error message
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold text-center mb-6">Customers</h2>
      
      {/* Top Clients Sections */}
      <h3 className="text-xl font-semibold mb-4">Top 10 Clients (Last 2 Months)</h3>
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full border table table-xs border-gray-300">
          <thead>
            <tr>
              <th className="border-b px-4 py-2">Name</th>
              <th className="border-b px-4 py-2">email</th>
              <th className="border-b px-4 py-2">Total Spent</th>
              <th className="border-b px-4 py-2">Orders Count</th>
            </tr>
          </thead>
          <tbody>
            {topClients.lastTwoMonths.map(customer => (
              <tr key={customer.id}>
                <td className="border-b px-4 py-2">{customer.name}</td>
                <td className="border-b px-4 py-2">{customer.email}</td>
                <td className="border-b px-4 py-2">£{customer.totalSpent.toFixed(2)}</td>
                <td className="border-b px-4 py-2">{customer.orderCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="text-xl font-semibold mb-4">Top 10 Clients (All Time)</h3>
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full border table table-xs border-gray-300">
          <thead>
            <tr>
              <th className="border-b px-4 py-2">Name</th>
              <th className="border-b px-4 py-2">email</th>
              <th className="border-b px-4 py-2">Total Spent</th>
              <th className="border-b px-4 py-2">Orders Count</th>
            </tr>
          </thead>
          <tbody>
            {topClients.allTime.map(customer => (
              <tr key={customer.id}>
                <td className="border-b px-4 py-2">{customer.name}</td>
                <td className="border-b px-4 py-2">{customer.email}</td>
                <td className="border-b px-4 py-2">£{customer.totalSpent.toFixed(2)}</td>
                <td className="border-b px-4 py-2">{customer.orderCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Customers Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border table table-xs border-gray-300">
          <thead>
            <tr>
              <th className="border-b px-4 py-2">Customer ID</th>
              <th className="border-b px-4 py-2">Name</th>
              <th className="border-b px-4 py-2">Total Spent</th>
              <th className="border-b px-4 py-2">Orders Count</th>
              <th className="border-b px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentCustomers.map(customer => (
              <tr key={customer.id}>
                <td className="border-b px-4 py-2">{customer.id}</td>
                <td className="border-b px-4 py-2">{customer.name}</td>
                <td className="border-b px-4 py-2">£{customer.totalSpent.toFixed(2)}</td>
                <td className="border-b px-4 py-2">{customer.orderCount}</td>
                <td className="border-b px-4 py-2">
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                    onClick={() => handleViewDetails(customer)}
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
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="bg-purple-500 text-white px-4 py-2 rounded"
        >
          Previous
        </button>
        <span>{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="bg-purple-500 text-white px-4 py-2 rounded"
        >
          Next
        </button>
      </div>

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg p-4 max-w-lg w-full">
            <h3 className="text-lg font-bold mb-4">Customer Details (ID: {selectedCustomer.id})</h3>
            <h4 className="font-semibold">Total Spent: £{selectedCustomer.totalSpent.toFixed(2)}</h4>
            <h4 className="font-semibold">Orders:</h4>
            <ul className="mb-4">
              {selectedCustomer.orders.map(order => (
                <li key={order.id} className="flex justify-between">
                  <span>Order ID: {order.id} - Date: {new Date(order.date).toLocaleDateString()}</span>
                  <span>Total:£ {order.total}</span>
                </li>
              ))}
            </ul>
            <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={handleCloseDetails}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
