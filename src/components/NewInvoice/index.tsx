"use client"

import Image from "next/image";
import React, { useReducer, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { v4 as uuidv4 } from "uuid";
import handleSendMail from "./mailerFunc"
import { useRouter } from "next/navigation";
import Link from 'next/link'
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { invoiceTemplate } from "@/lib/template/invoice_temp";

interface State {
  selectedCustomer: string | null;
  selectedProducts: { name: string; price: number; quantity: number }[];
  dueDate: Date | null;
  invoiceDate: Date | null;
  status: string;
  signature: string | null;
  notes: string;
  tax: number;
  signatureType: string;
  uploadedSignatures: string[];
}

type Action =
  | { type: "SET_FIELD"; field: keyof State; value: any }
  | { type: "ADD_PRODUCT"; product: { name: string; price: number } }
  | { type: "REMOVE_PRODUCT"; productName: string }
  | { type: "UPDATE_PRODUCT_QTY"; productName: string; quantity: number }
  | { type: "UPLOAD_SIGNATURE"; signature: string };

const initialState: State = {
  selectedCustomer: null,
  selectedProducts: [],
  dueDate: null,
  invoiceDate: null,
  status: "Pending",
  signature: null,
  notes: "",
  tax: 18,
  signatureType: "",
  uploadedSignatures: [],
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_FIELD":
      return {
        ...state,
        [action.field]: action.field === "tax" && action.value < 0 ? 0 : action.value,
      };
    case "ADD_PRODUCT":
      return state.selectedProducts.some(
        (product) => product.name === action.product.name
      )
        ? state
        : {
          ...state,
          selectedProducts: [
            ...state.selectedProducts,
            { ...action.product, quantity: 1 },
          ],
        };
    case "REMOVE_PRODUCT":
      return {
        ...state,
        selectedProducts: state.selectedProducts.filter(
          (product) => product.name !== action.productName
        ),
      };
    case "UPDATE_PRODUCT_QTY":
      return {
        ...state,
        selectedProducts: state.selectedProducts.map((product) =>
          product.name === action.productName
            ? { ...product, quantity: action.quantity }
            : product
        ),
      };
    case "UPLOAD_SIGNATURE":
      return {
        ...state,
        signature: action.signature,
      };
    default:
      return state;
  }
};

const NewInvoiceBox = () => {
  const router = useRouter();
  const pdfData = useRef(null);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [dialogVisible, setDialogVisible] = useState(false);
  const {
    selectedCustomer,
    selectedProducts,
    dueDate,
    invoiceDate,
    status,
    signature,
    notes,
    tax,
    signatureType,
  } = state;

  const customers = [
    { name: "John Doe", address: "123 Main St, City, State, 12345", gst: "GST12345" },
    { name: "Jane Smith", address: "456 Oak Ave, City, State, 67890", gst: "GST67890" },
  ];

  const products = [
    { name: "Product1", price: 100 },
    { name: "Product2", price: 200 },
    { name: "Product3", price: 300 },
  ];

  const uploadedSignatures = ["Signature1", "Signature2", "Signature3"];

  const totalAmount = selectedProducts.reduce(
    (total, product) => total + product.price * product.quantity,
    0
  );

  const taxAmount = (totalAmount * tax) / 100;
  const grandTotal = totalAmount + taxAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCustomer || selectedProducts.length === 0 || !dueDate || !invoiceDate) {
      alert("Please fill in all required fields.");
      return;
    }

    const invoiceData = {
      ...state,
      totalAmount,
      invoiceId: uuidv4(),
    };

    console.log(invoiceData);
  };

  function handlePreview() {
    let invoicePreviewData = ['page'];
    // router.push("/pages/previewInvoice", invoicePreviewData);
  }





  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row w-full">
      {/* Right Side: Invoice Preview */}
      <div
        id="invoice-preview"
        className="w-full sm:w-7/10 p-4 bg-white shadow-md rounded-md"
      >
        {/* Customer and Billing */}
        <div className="mb-4 custom-invoice-frombill">
          <div>
            <Image
              // src="https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg"
              src={"/images/logo.svg"}
              alt="Company Logo"
              width={100}
              height={100}
              className="w-22"
            />
            <h1 className="text-3xl font-bold">INVOICE - INV001</h1>
            <div className="pt-12 custom-billing-from-to">
              <div>
                <div>
                  <p className="font-bold">From:</p>
                  <p>Company Name</p>
                  <p>Company Address</p>
                  <p>GST: Company GST</p>
                </div>

              </div>
            </div>
          </div>
          <div>
            <p className="font-bold">Billing to:</p>
            <select
              value={selectedCustomer || ""}
              onChange={(e) =>
                dispatch({ type: "SET_FIELD", field: "selectedCustomer", value: e.target.value })
              }
              className="w-full p-2 border rounded-md"
            >
              <option value="" disabled>Select Customer</option>
              {customers.map((customer) => (
                <option key={customer.name} value={customer.name}>
                  {customer.name}
                </option>
              ))}
            </select>
            <p>{selectedCustomer ? customers.find(c => c.name === selectedCustomer)?.address : "Customer Address"}</p>
          </div>
        </div>


        {/* Invoice and Due Dates */}
        <div className="text-right flex justify-between mb-4">
          <div>
            <p className="text-lg">
              <span className="font-bold">Invoice Date:</span>
              <DatePicker
                selected={invoiceDate}
                onChange={(date) => dispatch({ type: "SET_FIELD", field: "invoiceDate", value: date })}
                dateFormat="MM/dd/yyyy"
                className="ml-2 p-1 border rounded-md"
              />
            </p>
            <p className="text-lg pb-10">
              <span className="font-bold">Due Date:</span>
              <DatePicker
                selected={dueDate}
                onChange={(date) => dispatch({ type: "SET_FIELD", field: "dueDate", value: date })}
                dateFormat="MM/dd/yyyy"
                className="ml-2 p-1 border rounded-md"
              />
            </p>
          </div>
        </div>

        {/* Products */}
        <div className="flex items-center mb-4">
          <select
            value="" // Ensure no product is selected initially
            onChange={(e) => {
              const selectedProduct = products.find((p) => p.name === e.target.value);
              if (selectedProduct) {
                dispatch({
                  type: "ADD_PRODUCT",
                  product: selectedProduct,
                });
              }
            }}
            className="w-full p-2 border rounded-md"
          >
            <option value="" disabled>Select Product</option>
            {products.map((product) => (
              <option key={product.name} value={product.name}>
                {product.name}
              </option>
            ))}
          </select>
        </div>

        <table className="w-full mb-4">
          <thead>
            <tr>
              <th className="border px-2 py-1">S.no</th>
              <th className="border px-2 py-1">Products</th>
              <th className="border px-2 py-1">Qty</th>
              <th className="border px-2 py-1">Price</th>
            </tr>
          </thead>
          <tbody>
            {selectedProducts.map((product, index) => (
              <tr key={index}>
                <td className="border px-2 py-1 text-center">{index + 1}</td>
                <td className="border px-2 py-1 text-center">{product.name}</td>
                <td className="border px-2 py-1 text-center">
                  <input
                    type="number"
                    value={product.quantity}
                    onChange={(e) =>
                      dispatch({
                        type: "UPDATE_PRODUCT_QTY",
                        productName: product.name,
                        quantity: parseInt(e.target.value),
                      })
                    }
                    className="w-full text-center p-1 border rounded-md"
                  />
                </td>
                <td className="border px-2 py-1 text-center">
                  ₹{product.price * product.quantity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Subtotal, Tax, and Total (Centered in an Invisible Table) */}
        <div className="flex justify-end mb-4 pt-22">
          <table className="text-center">
            <tbody>
              <tr className="invisible">
                <td className="p-2">Invisible</td>
              </tr>
              <tr>
                <td className="p-1">Subtotal:</td>
                <td className="p-1">₹{totalAmount.toFixed(2)}</td>
              </tr>
              <tr>
                <td className="p-1">Tax (%):</td>
                <td className="p-1">
                  <input
                    type="number"
                    value={tax}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_FIELD",
                        field: "tax",
                        value: parseInt(e.target.value),
                      })
                    }
                    className="w-16 text-right p-1 border rounded-md"
                  />
                </td>
              </tr>
              <tr>
                <td className="p-1">Tax Amount:</td>
                <td className="p-1">₹{taxAmount.toFixed(2)}</td>
              </tr>
              <tr>
                <td className="text-lg font-bold p-1">Total:</td>
                <td className="text-lg font-bold p-1">₹{grandTotal.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Authorized Signature */}
        <div className="text-right mt-8">
          <p>Authorized Signature:</p>
          <select
            value={signature || ""}
            onChange={(e) =>
              dispatch({ type: "UPLOAD_SIGNATURE", signature: e.target.value })
            }
            className="w-full p-2 border rounded-md"
          >
            <option value="" disabled>Select Signature</option>
            {uploadedSignatures.map((sig, index) => (
              <option key={index} value={sig}>
                {sig}
              </option>
            ))}
          </select>
        </div>

        {/* Notes */}
        <div className="mt-8 w-full">
          <p>Notes:</p>
          <textarea
            value={notes}
            onChange={(e) =>
              dispatch({ type: "SET_FIELD", field: "notes", value: e.target.value })
            }
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Preview and Send Invoice Buttons */}
        <div className="flex justify-between mt-8">
          <Link href={{
            pathname: '/pages/previewInvoice',
            query: { name: 'Digiprayas' } // the data
          }}>
            <button
              type="button"
              onClick={handlePreview}
              className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600"
            >
              Preview Invoice
            </button>
          </Link>
          <button
            type="button"
            onClick={() => handleSendMail("mailer mails").then(() => setDialogVisible(true))}
            className="bg-green-500 text-white px-4 py-2 rounded-md shadow hover:bg-green-600"
          >
            Send Invoice
          </button>
        </div>

        {/* Dialog box for Invoice Sent */}
        {dialogVisible && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
            <div className="bg-white p-6 rounded-md shadow-lg max-w-sm w-full text-center animate-fade-in">
              <h2 className="text-lg font-bold mb-2 text-green-600">Success!</h2>
              <p className="text-gray-700 mb-4">
                Invoice sent successfully to <span className="font-semibold">{"Mr Robort"}</span>
              </p>
              <button
                onClick={() => setDialogVisible(false)}
                className="bg-green-500 text-white px-4 py-2 rounded-md shadow hover:bg-green-600 transition"
              >
                OK
              </button>
            </div>
          </div>
        )}

      </div>
    </form>
  );
};

export default NewInvoiceBox;

