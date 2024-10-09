import { useState, useEffect } from "react";
import SkeletonLoader from "../Animation/SkeletonLoader";
import fetchFromWooCommerce from "../../utilities/fetchFromWooCommerce ";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 15; // Number of customers to display per page
  const [selectedCustomer, setSelectedCustomer] = useState(null); // State for selected customer

  // Inside your Customers component
  const [topClients, setTopClients] = useState({
    lastTwoMonths: [],
    allTime: [],
    lastYear: [], // New state to store top clients for the previous year
  });

  useEffect(() => {
    const fetchAllOrders = async () => {
    
      const allOrders = [];
      let page = 1;
      const perPage = 15; // Max number of orders per request

      try {
        while (true) {
          const { data, error } = await fetchFromWooCommerce("orders", {
            per_page: perPage,
            page: page,
          });
          if(error) {
            setError(error);
            break;
          }

          if (data.length === 0) break;

          allOrders.push(...data);
          page++;
        }

        const customerMap = {};
        const currentYear = new Date().getFullYear();
        const previousYear = currentYear - 1;
        const twoMonthsAgo = new Date();
        twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

        allOrders.forEach((order) => {
          const orderDate = new Date(order.date_created);
          const orderYear = orderDate.getFullYear();
          const customerId = order.customer_id || order.billing.email;
          const totalSpent = parseFloat(order.total);

          if (!customerMap[customerId]) {
            customerMap[customerId] = {
              id: customerId,
              name: `${order.billing.first_name} ${order.billing.last_name}`,
              totalSpent: 0,
              totalSpentLastYear: 0, // Track spending for the last year
              email: order.billing.email,
              orderCount: 0,
              orders: [],
            };
          }

          customerMap[customerId].totalSpent += totalSpent;
          if (orderYear === previousYear) {
            customerMap[customerId].totalSpentLastYear += totalSpent; // Sum up the spending for the last year
          }
          customerMap[customerId].orderCount += 1;
          customerMap[customerId].orders.push({
            id: order.id,
            date: order.date_created,
            total: totalSpent,
          });
        });

        const customerArray = Object.values(customerMap);
        setCustomers(customerArray);

        // Calculate top 10 clients for the last 2 months
        const topClientsLastTwoMonths = customerArray
          .filter((customer) =>
            customer.orders.some(
              (order) => new Date(order.date) >= twoMonthsAgo
            )
          )
          .sort((a, b) => b.totalSpent - a.totalSpent)
          .slice(0, 10);

        // Calculate top 10 clients of all time
        const topClientsAllTime = customerArray
          .sort((a, b) => b.totalSpent - a.totalSpent)
          .slice(0, 10);

        // Calculate top 10 clients of the last year
        const topClientsLastYear = customerArray
          .filter((customer) => customer.totalSpentLastYear > 0)
          .sort((a, b) => b.totalSpentLastYear - a.totalSpentLastYear)
          .slice(0, 10);

        setTopClients({
          lastTwoMonths: topClientsLastTwoMonths,
          allTime: topClientsAllTime,
          lastYear: topClientsLastYear,
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

  // Pagination logic for the main customer list
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = customers.slice(
    indexOfFirstCustomer,
    indexOfLastCustomer
  );
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
      <div className="xl:flex justify-between">
        <div className="overflow-x-auto mb-6">
          <h3 className="text-xl font-semibold mb-4">
            Top 10 Clients (Last 2 Months)
          </h3>
          <table className="min-w-full border table table-xs border-gray-300">
            <thead>
              <tr>
                <th className="border-b px-4 py-2">Name</th>
                {/* <th className="border-b px-4 py-2">email</th> */}
                <th className="border-b px-4 py-2">Total Spent</th>
                <th className="border-b px-4 py-2">Orders Count</th>
              </tr>
            </thead>
            <tbody>
              {topClients.lastTwoMonths.map((customer) => (
                <tr key={customer.id}>
                  <td className="border-b px-4 py-2">{customer.name}</td>
                  {/* <td className="border-b px-4 py-2">{customer.email}</td> */}
                  <td className="border-b px-4 py-2">
                    £{customer.totalSpent.toFixed(2)}
                  </td>
                  <td className="border-b px-4 py-2">{customer.orderCount}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Top Clients for Last Year Section */}
          <div className="overflow-x-auto mb-6">
            <h3 className="text-xl font-semibold mb-4">
              Top 10 Clients (Last Year)
            </h3>
            <table className="min-w-full border table table-xs border-gray-300">
              <thead>
                <tr>
                  <th className="border-b px-4 py-2">Name</th>
                  <th className="border-b px-4 py-2">
                    Total Spent (Last Year)
                  </th>
                  <th className="border-b px-4 py-2">Orders Count</th>
                </tr>
              </thead>
              <tbody>
                {topClients.lastYear.map((customer) => (
                  <tr key={customer.id}>
                    <td className="border-b px-4 py-2">{customer.name}</td>
                    <td className="border-b px-4 py-2">
                      £{customer.totalSpentLastYear.toFixed(2)}
                    </td>
                    <td className="border-b px-4 py-2">
                      {customer.orderCount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="overflow-x-auto xl:w-2/4 ">
          <h3 className="text-xl font-semibold mb-4">Customers Table </h3>
          <table className="min-w-full border table table-xs border-gray-300">
            <thead>
              <tr>
                <th className="border-b px-4 py-2">Name</th>
                <th className="border-b px-4 py-2">Total Spent</th>
                <th className="border-b px-4 py-2">Orders Count</th>
                <th className="border-b px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td className="border-b px-4 py-2">{customer.name}</td>
                  <td className="border-b px-4 py-2">
                    £{customer.totalSpent.toFixed(2)}
                  </td>
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
        <div className="overflow-x-auto mb-6">
          <h3 className="text-xl font-semibold mb-4">
            Top 10 Clients (All Time)
          </h3>
          <table className="min-w-full border table table-xs border-gray-300">
            <thead>
              <tr>
                <th className="border-b px-4 py-2">Name</th>
                {/* <th className="border-b px-4 py-2">email</th> */}
                <th className="border-b px-4 py-2">Total Spent</th>
                <th className="border-b px-4 py-2">Orders Count</th>
              </tr>
            </thead>
            <tbody>
              {topClients.allTime.map((customer) => (
                <tr key={customer.id}>
                  <td className="border-b px-4 py-2">{customer.name}</td>
                  {/* <td className="border-b px-4 py-2">{customer.email}</td> */}
                  <td className="border-b px-4 py-2">
                    £{customer.totalSpent.toFixed(2)}
                  </td>
                  <td className="border-b px-4 py-2">{customer.orderCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customers Table */}

      {/* Pagination Controls */}
      <div className="flex justify-between mt-6">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="bg-purple-500 text-white px-4 py-2 rounded"
        >
          Previous
        </button>
        <span>{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="bg-purple-500 text-white px-4 py-2 rounded"
        >
          Next
        </button>
      </div>

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-purple-500 text-black rounded shadow-lg p-4 max-w-lg w-full">
            <h3 className="text-lg font-bold mb-4">
              Customer Details (Name: {selectedCustomer.name})
            </h3>
            <h4 className="font-semibold">
              Total Spent: £{selectedCustomer.totalSpent.toFixed(2)}
            </h4>
            <h4 className="font-semibold mb-2">Orders:</h4>
            <table className="min-w-full table table-sm bg-white rounded shadow">
              <thead>
                <tr className="bg-purple-600 text-white">
                  <th className="py-2 px-4">Order ID</th>
                  <th className="py-2 px-4">Date</th>
                  <th className="py-2 px-4">Total</th>
                </tr>
              </thead>
              <tbody>
                {selectedCustomer.orders.map((order) => (
                  <tr key={order.id} className="border-b">
                    <td className="border-b py-2 px-4">{order.id}</td>
                    <td className="border-b px-4 py-2">
                      {new Date(order.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </td>
                    <td className="border-b py-2 px-4">
                      £{order.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded mt-4"
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

export default Customers;
