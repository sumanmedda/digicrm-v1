'use client';

import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from "next/navigation";
import { TiDeleteOutline } from "react-icons/ti";

const initialInvoiceData = [
  { invoiceId: "PRDT-001", sentTo: "John Doe", amount: "1,250", dueDate: "2024-09-15", status: "Paid" },
  { invoiceId: "PRDT-002", sentTo: "Jane Smith", amount: "2,450", dueDate: "2024-09-18", status: "Pending" },
  { invoiceId: "PRDT-003", sentTo: "Tom Johnson", amount: "3,550", dueDate: "2024-09-20", status: "Overdue" },
  { invoiceId: "PRDT-004", sentTo: "Emily Davis", amount: "1,750", dueDate: "2024-09-22", status: "Paid" },
  { invoiceId: "PRDT-005", sentTo: "Michael Brown", amount: "4,350", dueDate: "2024-09-25", status: "Pending" },
  { invoiceId: "PRDT-006", sentTo: "Chris Wilson", amount: "5,650", dueDate: "2024-09-27", status: "Overdue" },
  { invoiceId: "PRDT-007", sentTo: "Laura Miller", amount: "6,150", dueDate: "2024-09-30", status: "Paid" },
  { invoiceId: "PRDT-008", sentTo: "Kevin Garcia", amount: "7,250", dueDate: "2024-10-02", status: "Pending" },
  { invoiceId: "PRDT-009", sentTo: "Sarah Moore", amount: "8,350", dueDate: "2024-10-05", status: "Overdue" },
  { invoiceId: "PRDT-010", sentTo: "Daniel Taylor", amount: "9,450", dueDate: "2024-10-08", status: "Paid" },
  { invoiceId: "PRDT-011", sentTo: "Sophia Martinez", amount: "2,550", dueDate: "2024-10-10", status: "Pending" },
  { invoiceId: "PRDT-012", sentTo: "James Anderson", amount: "1,650", dueDate: "2024-10-12", status: "Overdue" },
  { invoiceId: "PRDT-013", sentTo: "Olivia Thomas", amount: "3,750", dueDate: "2024-10-15", status: "Paid" },
  { invoiceId: "PRDT-014", sentTo: "Jacob Lee", amount: "4,850", dueDate: "2024-10-18", status: "Pending" },
  { invoiceId: "PRDT-015", sentTo: "Ava Hernandez", amount: "5,950", dueDate: "2024-10-20", status: "Overdue" },
  { invoiceId: "PRDT-016", sentTo: "Mason Lewis", amount: "6,250", dueDate: "2024-10-23", status: "Paid" },
  { invoiceId: "PRDT-017", sentTo: "Mia Walker", amount: "7,350", dueDate: "2024-10-25", status: "Pending" },
  { invoiceId: "PRDT-018", sentTo: "Elijah Hall", amount: "8,450", dueDate: "2024-10-27", status: "Overdue" },
  { invoiceId: "PRDT-019", sentTo: "Lucas Young", amount: "9,550", dueDate: "2024-10-30", status: "Paid" },
  { invoiceId: "PRDT-020", sentTo: "Amelia King", amount: "1,850", dueDate: "2024-11-02", status: "Pending" },
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

  const handleStatusChange = (invoiceId: string, newStatus: string) => {
    const updatedInvoices = invoices.map((invoice) =>
      invoice.invoiceId === invoiceId ? { ...invoice, status: newStatus } : invoice
    );
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

  const isOverdue = (dueDate: string) => {
    const currentDate = new Date();
    return new Date(dueDate) < currentDate;
  };

  const handleAddProduct = () => {
    router.push("/pages/newproduct");
  };

  return (
    <div className="rounded-[10px] bg-white px-4 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      
      {/* Add Product Button */}
      <div className="mb-5.5">
        <button
          onClick={handleAddProduct}
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
            className="border border-gray-300 p-2 rounded-md mb-2 sm:mb-0 sm:mr-2 w-full sm:w-auto"
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
            className="border border-gray-300 p-2 rounded-md mb-2 sm:mb-0 sm:mr-2 w-full sm:w-auto"
          />
          <button
            onClick={handleDateClear}
            className="px-2 py-2 border border-black-700 rounded-md bg-black-600 text-black-700 hover:bg-red-200 w-full sm:w-auto h-10"
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
              Due Date
            </h5>
          </div>
          <div className="px-2 pb-3.5 text-center">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Status
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
              <p className="font-medium text-green-light-1">
                ${invoice.amount}
              </p>
            </div>

            <div className="flex items-center justify-center px-2 py-4">
              <p className={`font-medium ${isOverdue(invoice.dueDate) ? "text-red-500" : ""}`}>
                {invoice.dueDate}
              </p>
            </div>

            <div className="flex items-center justify-center px-2 py-4">
              <select
                value={invoice.status}
                onChange={(e) => handleStatusChange(invoice.invoiceId, e.target.value)}
                className={`font-medium px-2 py-2 rounded-md shadow ${
                  invoice.status === "Paid"
                    ? "text-green-500"
                    : invoice.status === "Overdue"
                    ? "text-red-500"
                    : "text-yellow-500"
                }`}
              >
                <option value="Paid" className="text-green-500">Paid</option>
                <option value="Pending" className="text-yellow-500">Pending</option>
                <option value="Overdue" className="text-red-500">Overdue</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          Previous
        </button>
        <p className="text-sm text-gray-700 dark:text-white">
          Page {currentPage} of {totalPages}
        </p>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductsBox;
