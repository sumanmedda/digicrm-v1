'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TiDeleteOutline } from "react-icons/ti";
import { FiCopy } from "react-icons/fi";

interface Customer {
  customerId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

const initialCustomerData = [
  { customerId: "CSTR-001", name: "Caparo", email: "sales@caparo.com", phone: "+91-7764598367" },
  { customerId: "CSTR-002", name: "LPS", email: "lps.sales@lps.com", phone: "+91-9987364738" },
  { customerId: "CSTR-003", name: "STL", email: "sales@stl.com", phone: "+91-7785947568" },
  { customerId: "CSTR-004", name: "SV Envirotech", email: "d.solanki@sve.com", phone: "+91-9873465789" },
  { customerId: "CSTR-005", name: "Sparsh Raysan", email: "sparsh.66@raysan.com", phone: "+01-8878734657" },
];

const CustomerBox = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [newCustomer, setNewCustomer] = useState<Customer[]>([]);


  const handleDelete = (customerId: string) => {
    const updatedCustomers = newCustomer.filter(customer => customer.customerId !== customerId);
    setNewCustomer(updatedCustomers);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const filteredCustomers = newCustomer.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleRowClick = (customer: any) => {
    router.push(`/pages/customer/${customer}`);
  };

  useEffect(() => {
    const newLocalCustomer = localStorage.getItem('newCustomer');
  
    if (newLocalCustomer) {
      try {
        const parsedCustomer = JSON.parse(newLocalCustomer);
        setNewCustomer(() => {
          return parsedCustomer ? [parsedCustomer, ...initialCustomerData] : initialCustomerData;
        });
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    }
  }, []);

  return (
    <div className="rounded-[10px] bg-white px-4 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">

    <div className="col-span-1">
      {/* Search and Add Customer Button */}
      <div className="flex items-center mb-5.5">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 p-2 rounded-md flex-grow"
        />
        
        {/* Add Customer Button */}
        <button
          onClick={() => router.push("/pages/newcustomer")}
          className="ml-2 px-4 py-2 border font-bold border-blue-500 rounded-md bg-blue-500 text-white hover:bg-blue-600 whitespace-nowrap"
        >
          Add Customer
        </button>
      </div>
    </div>
      
      {/* Customers Table */}
      <div className="overflow-x-auto">
        <div className="hidden sm:grid sm:grid-cols-4">
          <div className="px-2 pb-3.5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Customer Name
            </h5>
          </div>
          <div className="px-2 pb-3.5 text-center">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Email
            </h5>
          </div>
          <div className="px-2 pb-3.5 text-center">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Phone
            </h5>
          </div>
          <div className="px-2 pb-3.5 text-center">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Action
            </h5>
          </div>
        </div>

        {paginatedCustomers.map((customer) => (
          <div
            className="grid grid-cols-1 sm:grid-cols-4 sm:gap-0 gap-y-2 border-b border-stroke dark:border-dark-3 cursor-pointer sm:min-w-[500px] min-w-full"
            key={customer.customerId}
            onClick={() => handleRowClick(customer)}
          >
            <div className="flex items-center gap-3.5 px-2 py-4">
              <p className="font-medium text-dark dark:text-white sm:text-left text-center w-full sm:w-auto">
                {customer.name}
              </p>
            </div>

            <div className="flex items-center justify-between px-2 py-4 sm:justify-center sm:col-span-1">
              <p className="font-medium text-dark dark:text-white text-center sm:text-left">
                {customer.email}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy(customer.email);
                }}
                className="ml-2 text-gray-500 hover:text-gray-700"
              >
                <FiCopy />
              </button>
            </div>

            <div className="flex items-center justify-between px-2 py-4 sm:justify-center sm:col-span-1">
              <p className="font-medium text-dark dark:text-white text-center sm:text-left">
                {customer.phone}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy(customer.phone);
                }}
                className="ml-2 text-gray-500 hover:text-gray-700"
              >
                <FiCopy />
              </button>
            </div>

            <div className="flex items-center justify-center px-2 py-4 sm:justify-center sm:col-span-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(customer.customerId);
                }}
                className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 w-full sm:w-auto text-center"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border border-gray-300 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          Previous
        </button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border border-gray-300 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CustomerBox;