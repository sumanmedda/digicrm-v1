'use client';

import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from "next/navigation";
import { TiDeleteOutline } from "react-icons/ti";
import { MdModeEditOutline } from "react-icons/md";
import { MdOutlineDone } from "react-icons/md";

const initialInvoiceData = [
  { invoiceId: "PRDT-001", sentTo: "Chemical-1", amount: "1,250", qty: 5, dueDate: "2024-09-15" },
  { invoiceId: "PRDT-002", sentTo: "Chemical-2", amount: "2,450", qty: 10, dueDate: "2024-09-18" },
  { invoiceId: "PRDT-003", sentTo: "Chemical-3", amount: "3,550", qty: 8, dueDate: "2024-09-20" },
  // Add more products here...
];

const ProductsBox = () => {
  const router = useRouter();
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [invoices, setInvoices] = useState(initialInvoiceData);
  const [editableInvoiceId, setEditableInvoiceId] = useState<string | null>(null);
  const [editedValues, setEditedValues] = useState<any>({});
  const itemsPerPage = 5;

  const handleDelete = (invoiceId: string) => {
    const updatedInvoices = invoices.filter(invoice => invoice.invoiceId !== invoiceId);
    setInvoices(updatedInvoices);
  };

  const handleEditClick = (invoiceId: string, field: string, value: string) => {
    setEditableInvoiceId(invoiceId);
    setEditedValues((prevValues: any) => ({
      ...prevValues,
      [field]: value,
    }));
  };

  const handleValueChange = (e: any, field: string) => {
    const { value } = e.target;
    setEditedValues((prevValues: any) => ({
      ...prevValues,
      [field]: value,
    }));
  };

  const handleDoneClick = (invoiceId: string) => {
    setInvoices(prevInvoices =>
      prevInvoices.map(invoice =>
        invoice.invoiceId === invoiceId
          ? { ...invoice, ...editedValues }
          : invoice
      )
    );
    setEditableInvoiceId(null);
    setEditedValues({});
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
      <div className="flex flex-col justify-between mb-5.5">
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
              Product Name
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

        {invoices.length === 0 ? <><p className="flex justify-center">No Data Found</p></>
        :<>
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

            {/* Product Name */}
            <div className="flex items-center justify-center px-2 py-4">
              {editableInvoiceId === invoice.invoiceId ? (
                <input
                  type="text"
                  value={editedValues.sentTo || invoice.sentTo}
                  onChange={(e) => handleValueChange(e, "sentTo")}
                  className="border p-1 rounded"
                />
              ) : (
                <p className="font-medium text-dark dark:text-white">
                  {invoice.sentTo}
                </p>
              )}
            </div>

            {/* Amount */}
            <div className="flex items-center justify-center px-2 py-4">
              {editableInvoiceId === invoice.invoiceId ? (
                <input
                  type="text"
                  value={editedValues.amount || invoice.amount}
                  onChange={(e) => handleValueChange(e, "amount")}
                  className="border p-1 rounded"
                />
              ) : (
                <p className="font-medium text-dark dark:text-white">
                  ₹{invoice.amount}
                </p>
              )}
            </div>

            {/* Qty */}
            <div className="flex items-center justify-center px-2 py-4">
              {editableInvoiceId === invoice.invoiceId ? (
                <input
                  type="text"
                  value={editedValues.qty || invoice.qty}
                  onChange={(e) => handleValueChange(e, "qty")}
                  className="border p-1 rounded"
                />
              ) : (
                <p className="font-medium text-dark dark:text-white">
                  {invoice.qty}
                </p>
              )}
            </div>

            {/* Action */}
            <div className="flex items-center justify-center px-2 py-4">
            
              {editableInvoiceId === invoice.invoiceId ? (
                <button
                  onClick={() => handleDoneClick(invoice.invoiceId)}
                  className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  Done
                </button>
              ) : (
                <button
                  onClick={() => handleEditClick(invoice.invoiceId, "sentTo", invoice.sentTo)}
                  className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Edit
                </button>
              )}
              <div className="pl-2">
            <button
                  onClick={() => handleDelete(invoice.invoiceId)}
                  className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
            </div>
            </div>
          </div>
        ))}</>}
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

