'use client';

import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from "next/navigation";
import { TiDeleteOutline } from "react-icons/ti";

const initialInvoiceData = [
  { invoiceId: "PRDT-001", sentTo: "John Doe", amount: "1,250", qty: 5, dueDate: "2024-09-15" },
  { invoiceId: "PRDT-002", sentTo: "Jane Smith", amount: "2,450", qty: 10, dueDate: "2024-09-18" },
  { invoiceId: "PRDT-003", sentTo: "Tom Johnson", amount: "3,550", qty: 8, dueDate: "2024-09-20" },
  // Add more products here...
];

const ProductsBox = () => {
  const router = useRouter();
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [invoices, setInvoices] = useState(initialInvoiceData);
  const itemsPerPage = 5;

  const handleDateClear = () => {
    setStartDate(undefined);
    setEndDate(undefined);
  };

  const handleDelete = (invoiceId: string) => {
    const updatedInvoices = invoices.filter(invoice => invoice.invoiceId !== invoiceId);
    setInvoices(updatedInvoices);
  };

  const filteredInvoices = invoices.filter((invoice) => {
    const isWithinDateRange =
      (!startDate || new Date(invoice.dueDate) >= startDate) &&
      (!endDate || new Date(invoice.dueDate) <= endDate);

    const matchesSearchTerm =
      invoice.invoiceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.sentTo.toLowerCase().includes(searchTerm.toLowerCase());

    return isWithinDateRange && matchesSearchTerm;
  });

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="rounded-[10px] bg-white px-4 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      
      {/* Add Product Button */}
      <div className="mb-5.5">
        <button
          onClick={() => router.push("/pages/newproduct")}
          className="px-4 py-2 border border-green-500 rounded-md bg-green-500 text-white hover:bg-green-600 w-full sm:w-auto"
        >
          Add Product
        </button>
      </div>

      {/* Date Pickers and Search */}
      <div className="flex flex-col sm:flex-row justify-between mb-5.5">
        <div className="flex flex-col sm:flex-row items-center mb-4 sm:mb-0 w-full">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date || undefined)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            placeholderText="Start Date"
            dateFormat={"yyyy-MM-dd"}
            className="border border-gray-300 p-2 rounded-md mb-2 sm:mb-0 sm:mr-2 w-full"
          />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date || undefined)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            placeholderText="End Date"
            dateFormat={"yyyy-MM-dd"}
            className="border border-gray-300 p-2 rounded-md mb-2 sm:mb-0 w-full"
          />
          <button
            onClick={handleDateClear}
            className="h-10 px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 w-full sm:w-auto mt-2 sm:mt-0 sm:ml-2"
          >
            <TiDeleteOutline />
          </button>
        </div>
        <div className="flex items-center w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 p-2 rounded-md w-full"
          />
        </div>
      </div>

      {/* Invoices Table */}
      <div className="overflow-x-auto">
        <div className="min-w-[600px] grid grid-cols-5">
          <div className="px-2 pb-3.5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Product ID
            </h5>
          </div>
          <div className="px-2 pb-3.5 text-center">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Sent To
            </h5>
          </div>
          <div className="px-2 pb-3.5 text-center">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Amount
            </h5>
          </div>
          <div className="px-2 pb-3.5 text-center">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Qty
            </h5>
          </div>
          <div className="px-2 pb-3.5 text-center">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Action
            </h5>
          </div>
        </div>

        {paginatedInvoices.map((invoice) => (
          <div
            className={`grid min-w-[600px] grid-cols-5 border-b border-stroke dark:border-dark-3`}
            key={invoice.invoiceId}
          >
            <div className="flex items-center gap-3.5 px-2 py-4">
              <p className="font-medium text-dark dark:text-white">
                {invoice.invoiceId}
              </p>
            </div>

            <div className="flex items-center justify-center px-2 py-4">
              <p className="font-medium text-dark dark:text-white">
                {invoice.sentTo}
              </p>
            </div>

            <div className="flex items-center justify-center px-2 py-4">
              <p className="font-medium text-dark dark:text-white">
                ${invoice.amount}
              </p>
            </div>

            <div className="flex items-center justify-center px-2 py-4">
              <p className="font-medium text-dark dark:text-white">
                {invoice.qty}
              </p>
            </div>

            <div className="flex items-center justify-center px-2 py-4">
              <button
                onClick={() => handleDelete(invoice.invoiceId)}
                className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
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

export default ProductsBox;
