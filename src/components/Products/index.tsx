'use client';

import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from "next/navigation";
import { FaTrash } from "react-icons/fa6";
import { MdModeEditOutline } from "react-icons/md";
import { MdOutlineDone } from "react-icons/md";

const initialInvoiceData = [
  { productId: "PRDT-001", hsnSacCode:"28331990", chem: "Sodium Chloride", amount: "1,250", qty: 5, expiryDate: "2024-09-15" },
  { productId: "PRDT-002", hsnSacCode:"36531968", chem: "Potassium Nitrate", amount: "2,450", qty: 10, expiryDate: "2024-09-18" },
  { productId: "PRDT-003", hsnSacCode:"22331597", chem: "Sodium Bicarbonate", amount: "3,550", qty: 8, expiryDate: "2024-09-20" },
  // Add more products here...
];

interface NewProduct {
  productId: string;
  hsnSacCode: string;
  chem: string;
  amount: string;
  qty: string;
  expiryDate: string;
}

const ProductsBox = () => {
  const router = useRouter();
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  // const [invoices, setInvoices] = useState(initialInvoiceData);
  const [editableInvoiceId, setEditableInvoiceId] = useState<string | null>(null);
  const [editedValues, setEditedValues] = useState<any>({});
  const itemsPerPage = 5;
  const [addNewProduct, setAddNewProduct] = useState<NewProduct[]>([]);

  useEffect(() => {
    const storedNewProduct = localStorage.getItem("newProduct");
    if (storedNewProduct) {
      try {
        const parsedProduct = JSON.parse(storedNewProduct);

        console.log('Parsed Item ==', parsedProduct)
        
        // Update state using setNewCustomer
        setAddNewProduct(() => {
          return addNewProduct ? [parsedProduct, ...initialInvoiceData] : initialInvoiceData;
        });
        
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    }
  }, []);

  const handleDelete = (invoiceId: string) => {
    const updatedInvoices = addNewProduct.filter(invoice => invoice.productId !== invoiceId);
    setAddNewProduct(updatedInvoices);
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
    setAddNewProduct(prevInvoices =>
      prevInvoices.map(invoice =>
        invoice.productId === invoiceId
          ? { ...invoice, ...editedValues }
          : invoice
      )
    );
    setEditableInvoiceId(null);
    setEditedValues({});
  };

  const filteredInvoices = addNewProduct.filter((invoice) => {
    const isWithinDateRange =
      (!startDate || new Date(invoice.expiryDate) >= startDate) &&
      (!endDate || new Date(invoice.expiryDate) <= endDate);

    const matchesSearchTerm =
      invoice.productId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.chem.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.hsnSacCode.toLowerCase().includes(searchTerm.toLowerCase());

    return isWithinDateRange && matchesSearchTerm;
  });

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="rounded-[10px] bg-white px-4 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="col-span-1">
        {/* Date Pickers and Search with Add Product Button */}
          <div className="flex items-center mb-5.5">
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 p-2 rounded-md flex-grow"
            />
          
        {/* Add Product Button */}
          <button
            onClick={() => router.push("/pages/newproduct")}
            className="ml-2 px-4 py-2 border font-bold border-blue-500 rounded-md bg-blue-500 text-white hover:bg-blue-600"
          >
            Add Product
          </button>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="overflow-x-auto">
        <div className="min-w-[600px] grid grid-cols-7">
          <div className="px-2 pb-3.5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Product ID
            </h5>
          </div>
          <div className="px-2 pb-3.5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              HSN/SAC Code
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
              Expiry Date
            </h5>
          </div>
          <div className="px-2 pb-3.5 text-center">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Action
            </h5>
          </div>
        </div>

        {addNewProduct.length === 0 ? <><p className="flex justify-center">No Data Found</p></>
        :<>
        {paginatedInvoices.map((invoice) => (
          <div
            className={`grid min-w-[600px] grid-cols-7 border-b border-stroke dark:border-dark-3`}
            key={invoice.productId}
          >
            <div className="flex items-center gap-3.5 px-2 py-4">
              <p className="font-medium text-dark dark:text-white">
                {invoice.productId}
              </p>
            </div>

            <div className="flex items-center gap-3.5 px-2 py-4">
              <p className="font-medium text-dark dark:text-white">
                {invoice.hsnSacCode}
              </p>
            </div>

            {/* Product Name */}
            <div className="flex items-center px-2 py-4">
              {editableInvoiceId === invoice.productId ? (
                <input
                  type="text"
                  value={editedValues.chem || invoice.chem}
                  onChange={(e) => handleValueChange(e, "chem")}
                  className="border p-1 rounded"
                />
              ) : (
                <p className="font-medium text-dark dark:text-white">
                  {invoice.chem}
                </p>
              )}
            </div>

            {/* Amount */}
            <div className="flex items-center justify-center px-2 py-4">
              {editableInvoiceId === invoice.productId ? (
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
              {editableInvoiceId === invoice.productId ? (
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

            <div className="flex items-center justify-center px-2 py-4">
              {editableInvoiceId === invoice.productId ? (
                <input
                  type="text"
                  value={editedValues.expiryDate || invoice.expiryDate}
                  onChange={(e) => handleValueChange(e, "expiryDate")}
                  className="border p-1 rounded"
                />
              ) : (
                <p className="font-medium text-dark dark:text-white">
                  {invoice.expiryDate}
                </p>
              )}
            </div>

            {/* Action */}
            <div className="flex items-center justify-center px-2 py-4">
            
              {editableInvoiceId === invoice.productId ? (
                <button
                  onClick={() => handleDoneClick(invoice.productId)}
                  className="px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  <MdOutlineDone />
                </button>
              ) : (
                <button
                  onClick={() => handleEditClick(invoice.productId, "sentTo", invoice.chem)}
                  className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  <MdModeEditOutline />
                </button>
              )}
              <div className="pl-2">
            <button
                  onClick={() => handleDelete(invoice.productId)}
                  className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  <FaTrash />
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

