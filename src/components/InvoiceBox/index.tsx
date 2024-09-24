'use client';

import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from "next/navigation";
import { TiDeleteOutline } from "react-icons/ti";
import CustomLoader from "../CustomLoader";

const initialInvoiceData = [
  { invoiceId: "INV-001", sentTo: "John Doe", amount: "1,250", dueDate: "2024-09-15", status: "Paid" },
  { invoiceId: "INV-002", sentTo: "Jane Smith", amount: "2,450", dueDate: "2024-09-18", status: "Pending" },
  { invoiceId: "INV-003", sentTo: "Tom Johnson", amount: "3,550", dueDate: "2024-09-20", status: "Overdue" },
  { invoiceId: "INV-004", sentTo: "Emily Davis", amount: "1,750", dueDate: "2024-09-22", status: "Paid" },
  { invoiceId: "INV-005", sentTo: "Michael Brown", amount: "4,350", dueDate: "2024-09-25", status: "Pending" },
  { invoiceId: "INV-006", sentTo: "Chris Wilson", amount: "5,650", dueDate: "2024-10-01", status: "Upcoming" },
  { invoiceId: "INV-007", sentTo: "Laura Miller", amount: "6,150", dueDate: "2024-09-30", status: "Paid" },
  { invoiceId: "INV-008", sentTo: "Kevin Garcia", amount: "7,250", dueDate: "2024-10-02", status: "Upcoming" },
  { invoiceId: "INV-009", sentTo: "Sarah Moore", amount: "8,350", dueDate: "2024-10-05", status: "Overdue" },
  { invoiceId: "INV-010", sentTo: "Daniel Taylor", amount: "9,450", dueDate: "2024-10-08", status: "Paid" },
  { invoiceId: "INV-011", sentTo: "Sophia Martinez", amount: "2,550", dueDate: "2024-09-28", status: "Pending" },
];

const InvoiceBox = () => {
  const router = useRouter();
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [startLoader, setStartLoader] = useState(false);
  const [invoices, setInvoices] = useState(initialInvoiceData);
  const [selectedTab, setSelectedTab] = useState("All");
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

  const filterByTab = (invoice: any) => {
    if (selectedTab === "All") return true;
    if (selectedTab === "Upcoming") return invoice.status === "Upcoming";
    if (selectedTab === "Overdue") return invoice.status === "Overdue";
    if (selectedTab === "Paid") return invoice.status === "Paid";
    return true;
  };

  const filteredInvoices = invoices
    .filter(filterByTab)
    .filter((invoice) => {
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

  // router.push("/pages/newInvoice");

  const handleAddProduct = () => {
    setStartLoader(true);
    setTimeout(() => {
      setStartLoader(false);
    }, 4000);
  };

  return (
    <div className="rounded-[10px] bg-white px-4 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      
      {/* Add Product Button */}
      <div className="mb-5.5">
        <button
          onClick={handleAddProduct}
          className="px-4 py-2 border border-green-500 rounded-md bg-green-500 text-white hover:bg-green-600 w-full sm:w-auto"
        >
          {!startLoader?"Add Invoice" :<CustomLoader />} 
        </button>
      </div>

      {/* Tabs */}
      <div className="flex justify-between w-full mb-5.5">
        {["All", "Upcoming", "Overdue", "Paid"].map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`w-full px-4 py-2 text-center border-b-2 ${
              selectedTab === tab
                ? "bg-green-500 text-white"
                : "border-transparent text-gray-500 hover:border-gray-300"
            }`}
          >
            {tab}
          </button>
        ))}
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
              Invoice ID
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
            <div className="flex items-center justify-center px-2 py-4 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {invoice.sentTo}
              </p>
            </div>
            <div className="flex items-center justify-center px-2 py-4 text-center">
              <p className="font-medium text-green-500">${invoice.amount}</p>
            </div>
            <div className="flex items-center justify-center px-2 py-4 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {invoice.dueDate}
              </p>
            </div>
            <div className="flex items-center justify-center px-2 py-4 text-center">
              <select
                value={invoice.status}
                onChange={(e) =>
                  handleStatusChange(invoice.invoiceId, e.target.value)
                }
                className={`inline-block rounded-full px-4 py-1.5 text-sm font-medium capitalize ${
                  invoice.status === "Paid"
                    ? "bg-green-100 text-green-500"
                    : invoice.status === "Overdue"
                    ? "bg-red-100 text-red-500"
                    : invoice.status === "Upcoming"
                    ? "bg-yellow-100 text-yellow-500"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                <option value="Paid">Paid</option>
                <option value="Overdue">Overdue</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>
        ))}

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-center space-x-4">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={`h-10 w-10 rounded-full border border-gray-300 ${
                currentPage === index + 1
                  ? "bg-green-500 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InvoiceBox;
