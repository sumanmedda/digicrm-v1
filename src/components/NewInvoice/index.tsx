"use client"

import Image from "next/image";
import React, { useEffect, useReducer, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { v4 as uuidv4 } from "uuid";
import handleSendMail from "./mailerFunc"
import { useRouter } from "next/navigation";
import Link from 'next/link'
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { invoiceTemplate } from "@/lib/template/invoice_temp";
import CustomAlert from "../CustomAlert";

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

interface Customer {
  name: string;
  email: string;
  phone: string;
  address: string;
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
            ? { ...product, quantity: Math.max(action.quantity, 1) } // Ensure quantity is at least 1
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
  const [newCustomer, setNewCustomer] = useState<Customer[]>([]);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedCustomerMail, setSelectedCustomerMail] = useState("");
  const [selectedCustomerPhone, setSelectedCustomePhone] = useState('');
  const [alertMessage, setAlertMessage] = useState<{ message?: string; type?: string }>({});

  const showAlert = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    setAlertMessage({ message, type });
    setTimeout(() => setAlertMessage({}), 3000); // Clear alert after 3 seconds
  };

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
    { name: "Rakesh Jain", email: "rjain55@gmail.com", phone: "9867456767", address: "123 Main St, City, State, 12345" },
    { name: "Brijesh Kumar", email: "brijeshk778@gmail.com", phone: "9856645457", address: "456 Oak Ave, City, State, 67890" },
  ];

  useEffect(() => {
    const newLocalCustomer = localStorage.getItem('newCustomer');
  
    if (newLocalCustomer) {
      try {
        const parsedCustomer = JSON.parse(newLocalCustomer);
        setNewCustomer(() => {
          return parsedCustomer ? [...customers, parsedCustomer] : customers;
        });
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    }
  }, []);

  const products = [
    { name: "Sodium Bicarbonate", price: 4500 },
    { name: "Potassium Nitrate", price: 6758 },
    { name: "Ferrous Sulfate", price: 3000 },
  ];

  const uploadedSignatures = ["UttamMedda", "RonakSharma", "NitinVyas"];

  const totalAmount = selectedProducts.reduce(
    (total, product) => total + product.price * product.quantity,
    0
  );

  const taxAmount = (totalAmount * tax) / 100;
  const grandTotal = totalAmount + taxAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newInvoiceId = uuidv4();

    if (!selectedCustomer || selectedProducts.length === 0 || !dueDate || !invoiceDate) {
      showAlert('Please fill in all required fields.!', 'warning');
      return;
    }

    const invoiceData = {
      ...state,
      totalAmount,
      invoiceId: newInvoiceId,
    };

    console.log(invoiceData);
    // You can call the send mail function here if needed, passing invoiceData
    handleSendMail(
      selectedCustomer,
      newCustomer.find((c: Customer) => c.name === selectedCustomer)?.address,
      newCustomer.find((c: Customer) => c.name === selectedCustomer)?.email,
      newCustomer.find((c: Customer) => c.name === selectedCustomer)?.phone,
      grandTotal.toFixed(2)
    )

    const newInvoiceData = {
      'invoiceId':newInvoiceId,'sentTo':selectedCustomer,'amount':totalAmount,'dueDate':dueDate,'status':'Pending'
    }
    localStorage.setItem('invoiceData', JSON.stringify(newInvoiceData));
    showAlert('Invoice Sent Successfully!', 'success');
    router.back();
  };

  return <>
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row w-full">
      {/* Right Side: Invoice Preview */}
      <div
        id="invoice-preview"
        className="w-full sm:w-7/10 p-12 bg-white shadow-md rounded-md"
      >
        {/* Customer and Billing */}
        <div className="mb-4 custom-invoice-frombill">
          <div>
            <Image
              src={"https://www.caparo.co.in/images/logo.svg"}
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
                  <p>Caparo</p>
                  <p>A-7, Chopanki Industrial Area, Bhiwadi, Alwar-415514, Rajasthan, India</p>
                  <p>GST: 08AABCC7862N1Z4</p>
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
              {newCustomer.map((customer: Customer) => (
                <option key={customer.name} value={customer.name}>
                  {customer.name}
                </option>
              ))}
            </select>
            <p>{selectedCustomer ? newCustomer.find((c: Customer) => c.name === selectedCustomer)?.address : "Customer Address"}</p>
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
            <p className="text-lg pt-1 pb-10">
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
                {product.name} - ₹{product.price}
              </option>
            ))}
          </select>
        </div>

        {/* Product Table */}
        <table className="w-full mb-4">
          <thead>
            <tr>
              <th className="text-left">Product</th>
              <th className="text-left">Price</th>
              <th className="text-left">Qty</th>
              <th className="text-left">Total</th>
              <th className="text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {selectedProducts.map((product) => (
              <tr key={product.name}>
                <td>{product.name}</td>
                <td>₹{product.price}</td>
                <td>
                  <input
                    type="number"
                    value={product.quantity}
                    onChange={(e) =>
                      dispatch({
                        type: "UPDATE_PRODUCT_QTY",
                        productName: product.name,
                        quantity: Number(e.target.value),
                      })
                    }
                    min={1} // Ensure minimum quantity is 1
                    className="w-16 p-1 border rounded-md text-center"
                  />
                </td>
                <td>₹{product.price * product.quantity}</td>
                <td>
                  <button
                    type="button"
                    onClick={() =>
                      dispatch({
                        type: "REMOVE_PRODUCT",
                        productName: product.name,
                      })
                    }
                    className="p-2 text-red-500"
                  >
                    Remove
                  </button>
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

        {/* Signature */}
        <div className="mb-4">
          <label htmlFor="signature" className="block font-bold mb-1">
            Signature
          </label>
          <select
            value={signatureType}
            onChange={(e) => dispatch({ type: "SET_FIELD", field: "signatureType", value: e.target.value })}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Select Signature</option>
            {uploadedSignatures.map((sign) => (
              <option key={sign} value={sign}>
                {sign}
              </option>
            ))}
          </select>
        </div>

        {/* Notes */}
        <div className="mb-4">
          <label htmlFor="notes" className="block font-bold mb-1">
            Notes
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) =>
              dispatch({ type: "SET_FIELD", field: "notes", value: e.target.value })
            }
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Send Invoice Button */}
        <div className="text-right">
          <button
            type="submit"
            className="p-2 bg-blue-500 text-white font-bold rounded-md"
          >
            Send Invoice
          </button>
        </div>
      </div>
    </form>
    <CustomAlert message={alertMessage.message || ''} type={alertMessage.type as any} />

  </>
};

export default NewInvoiceBox;

