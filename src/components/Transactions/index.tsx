'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const initialTransactionData = [
  { transactionId: "TXN-001", customer: "John Doe", amount: "1,250", billingDate: "2024-09-01", settlementDate: "2024-09-10", type: "Credit" },
  { transactionId: "TXN-002", customer: "Jane Smith", amount: "2,450", billingDate: "2024-09-02", settlementDate: "2024-09-12", type: "Debit" },
  { transactionId: "TXN-003", customer: "Tom Johnson", amount: "3,550", billingDate: "2024-09-03", settlementDate: "2024-09-13", type: "Credit" },
  { transactionId: "TXN-004", customer: "Emily Davis", amount: "1,750", billingDate: "2024-09-04", settlementDate: "2024-09-14", type: "Debit" },
  { transactionId: "TXN-005", customer: "Michael Brown", amount: "4,350", billingDate: "2024-09-05", settlementDate: "2024-09-15", type: "Credit" },
  // Add 15 more entries...
];

const TransactionBox = () => {
  const router = useRouter();
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [transactions, setTransactions] = useState(initialTransactionData);
  const itemsPerPage = 5;

  const handleDateClear = () => {
    setStartDate(undefined);
    setEndDate(undefined);
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const isWithinDateRange =
      (!startDate || new Date(transaction.billingDate) >= startDate) &&
      (!endDate || new Date(transaction.settlementDate) <= endDate);

    const matchesSearchTerm =
      transaction.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.customer.toLowerCase().includes(searchTerm.toLowerCase());

    return isWithinDateRange && matchesSearchTerm;
  });

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleRowClick = (transactionId: string) => { 
    router.push(`/pages/transactions/${transactionId}`);  
  };

  const getTransactionColor = (type: string) => {
    return type === "Debit" ? "text-red-500" : "text-green-500";
  };

  return (
    <div className="rounded-[10px] bg-white px-4 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">

      {/* Add Transaction Button */}
      {/* <div className="mb-5.5">
        <button
          onClick={() => router.push("/pages/newproduct")}
          className="px-4 py-2 border border-green-500 rounded-md bg-green-500 text-white hover:bg-green-600 w-full sm:w-auto"
        >
          Add Transaction
        </button>
      </div> */}

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
            className=" border border-gray-300 p-2 rounded-md mb-2 sm:mb-0 sm:mr-2 w-full"
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
            Clear Dates
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

      {/* Transactions Table */}
      <div className="overflow-x-auto">
        <div className="min-w-[700px] grid grid-cols-6">
          <div className="px-2 pb-3.5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Transaction ID</h5>
          </div>
          <div className="px-2 pb-3.5 text-center">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Customer</h5>
          </div>
          <div className="px-2 pb-3.5 text-center">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Amount</h5>
          </div>
          <div className="px-2 pb-3.5 text-center">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Billing Date</h5>
          </div>
          <div className="px-2 pb-3.5 text-center">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Settlement Date</h5>
          </div>
          <div className="px-2 pb-3.5 text-center">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Type</h5>
          </div>
        </div>

        {paginatedTransactions.map((transaction) => (
          <div
            key={transaction.transactionId}
            onClick={() => handleRowClick(transaction.transactionId)}
            className={`grid min-w-[700px] grid-cols-6 border-b border-stroke dark:border-dark-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700`}
          >
            <div className="flex items-center gap-3.5 px-2 py-4">
              <p className="font-medium text-dark dark:text-white">{transaction.transactionId}</p>
            </div>
            <div className="flex items-center justify-center px-2 py-4">
              <p className="font-medium text-dark dark:text-white">{transaction.customer}</p>
            </div>
            <div className="flex items-center justify-center px-2 py-4">
              <p className="font-medium text-green-light-1">${transaction.amount}</p>
            </div>
            <div className="flex items-center justify-center px-2 py-4">
              <p className="font-medium text-dark dark:text-white">{transaction.billingDate}</p>
            </div>
            <div className="flex items-center justify-center px-2 py-4">
              <p className="font-medium text-dark dark:text-white">{transaction.settlementDate}</p>
            </div>
            <div className="flex items-center justify-center px-2 py-4">
              <p className={`font-medium ${getTransactionColor(transaction.type)}`}>{transaction.type}</p>
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

export default TransactionBox;
