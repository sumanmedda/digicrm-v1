'use client';

import React, { useReducer } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { v4 as uuidv4 } from "uuid";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Define the state type
interface State {
  selectedCustomer: string | null;
  selectedProducts: { name: string; price: number; quantity: number }[];
  dueDate: Date | null;
  invoiceDate: Date | null;
  status: string;
  signature: File | null;
  notes: string;
  tax: number;
  signatureType: string;
  uploadedSignatures: File[]; // Array to hold uploaded signatures
}

// Define the action types
type Action =
  | { type: "SET_FIELD"; field: keyof State; value: any }
  | { type: "ADD_PRODUCT"; product: { name: string; price: number } }
  | { type: "REMOVE_PRODUCT"; productName: string }
  | { type: "UPDATE_PRODUCT_QTY"; productName: string; quantity: number }
  | { type: "UPLOAD_SIGNATURE"; signature: File };

// Initialize the state
const initialState: State = {
  selectedCustomer: null,
  selectedProducts: [],
  dueDate: null,
  invoiceDate: null,
  status: "Pending",
  signature: null,
  notes: "",
  tax: 18,  // Default tax percentage
  signatureType: "",
  uploadedSignatures: [],
};

// Reducer function
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_FIELD":
      return {
        ...state,
        [action.field]: action.field === "tax" && action.value < 0 ? 0 : action.value
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
        uploadedSignatures: [...state.uploadedSignatures, action.signature],
      };
    default:
      return state;
  }
};

const NewInvoiceBox = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { selectedCustomer, selectedProducts, dueDate, invoiceDate, status, signature, notes, tax, signatureType, uploadedSignatures } =
    state;

  const customers = [
    { name: "John Doe", address: "123 Main St, City, State, 12345" },
    { name: "Jane Smith", address: "456 Oak Ave, City, State, 67890" },
  ];

  const products = [
    { name: "Product1", price: 100 },
    { name: "Product2", price: 200 },
    { name: "Product3", price: 300 },
  ];

  const totalAmount = selectedProducts.reduce(
    (total, product) => total + product.price * product.quantity,
    0
  );

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

    // Generate PDF
    const input = document.getElementById("invoice-preview");
    if (input) {
      html2canvas(input).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");

        // Create a new jsPDF document
        const pdf = new jsPDF("p", "mm", "a4");

        // Calculate the width and height for the image
        const imgWidth = 210; // Width of A4 in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Add the image to the PDF
        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

        // Save the PDF
        pdf.save("invoice.pdf");
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row w-full">
      {/* Left Side: Form */}
      <div className="w-full sm:w-3/10 p-4 bg-white shadow-md rounded-md">
        {/* Customer Selection */}
        <div className="mb-4">
          <label className="block text-gray-700">Customer Name</label>
          <select
            value={selectedCustomer || ""}
            onChange={(e) =>
              dispatch({
                type: "SET_FIELD",
                field: "selectedCustomer",
                value: e.target.value ? e.target.value : null,
              })
            }
            className="border rounded-md p-2 w-full"
          >
            <option value="">Select Customer</option>
            {customers.map((customer) => (
              <option key={customer.name} value={customer.name}>
                {customer.name}
              </option>
            ))}
          </select>
        </div>

        {/* Product Selection */}
        <div className="mb-4">
          <label className="block text-gray-700">Products</label>
          <select
            onChange={(e) =>
              dispatch({
                type: "ADD_PRODUCT",
                product: products.find((p) => p.name === e.target.value)!,
              })
            }
            className="border rounded-md p-2 w-full"
          >
            <option value="">Select Product</option>
            {products
              .filter((product) => !selectedProducts.some((p) => p.name === product.name))
              .map((product) => (
                <option key={product.name} value={product.name}>
                  {product.name}
                </option>
              ))}
          </select>

          <div className="mt-2">
            {selectedProducts.map((product) => (
              <div
                key={product.name}
                className="flex justify-between items-center border rounded-md p-2 mt-2"
              >
                <span>{product.name} (Qty: {product.quantity})</span>
                <input
                  type="number"
                  min="1"
                  value={product.quantity}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_PRODUCT_QTY",
                      productName: product.name,
                      quantity: parseInt(e.target.value, 10),
                    })
                  }
                  className="w-16 ml-4 border rounded-md p-1"
                />
                <button
                  onClick={() => dispatch({ type: "REMOVE_PRODUCT", productName: product.name })}
                  className="text-red-500 ml-4"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Tax Percentage */}
        <div className="mb-4">
          <label className="block text-gray-700">Tax (%)</label>
          <input
            type="number"
            value={tax}
            onChange={(e) =>
              dispatch({ type: "SET_FIELD", field: "tax", value: parseFloat(e.target.value) })
            }
            className="border rounded-md p-2 w-full"
            min="0" // Prevents negative values
          />
        </div>

        {/* Date Pickers */}
        <div className="mb-4">
          <label className="block text-gray-700">Due Date</label>
          <DatePicker
            selected={dueDate}
            onChange={(date) => dispatch({ type: "SET_FIELD", field: "dueDate", value: date })}
            className="border rounded-md p-2 w-full"
            placeholderText="Select Due Date"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Invoice Date</label>
          <DatePicker
            selected={invoiceDate}
            onChange={(date) => dispatch({ type: "SET_FIELD", field: "invoiceDate", value: date })}
            className="border rounded-md p-2 w-full"
            placeholderText="Select Invoice Date"
          />
        </div>

        {/* Status Selection */}
        <div className="mb-4">
          <label className="block text-gray-700">Status</label>
          <select
            value={status}
            onChange={(e) =>
              dispatch({ type: "SET_FIELD", field: "status", value: e.target.value })
            }
            className="border rounded-md p-2 w-full"
          >
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>

        {/* Signature Selection */}
        <div className="mb-4">
          <label className="block text-gray-700">Signature Type</label>
          <select
            value={signatureType}
            onChange={(e) =>
              dispatch({
                type: "SET_FIELD",
                field: "signatureType",
                value: e.target.value,
              })
            }
            className="border rounded-md p-2 w-full"
          >
            <option value="">Select Signature Type</option>
            <option value="uploaded">Choose from Uploaded Signatures</option>
            <option value="new">Upload New Signature</option>
          </select>
        </div>

        {signatureType === "uploaded" && (
          <div className="mb-4">
            <label className="block text-gray-700">Choose Signature</label>
            <select
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "signature",
                  value: uploadedSignatures.find(
                    (sig) => sig.name === e.target.value
                  ),
                })
              }
              className="border rounded-md p-2 w-full"
            >
              <option value="">Select Signature</option>
              {uploadedSignatures.map((sig) => (
                <option key={sig.name} value={sig.name}>
                  {sig.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {signatureType === "new" && (
        <div className="mb-4">
            <label className="block text-gray-700">Upload Signature</label>
            <input
            type="file"
            onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                dispatch({
                    type: "UPLOAD_SIGNATURE",
                    signature: file,
                });
                }
            }}
            className="border rounded-md p-2 w-full"
            />
        </div>
)}

        {/* Notes */}
        <div className="mb-4">
          <label className="block text-gray-700">Notes</label>
          <textarea
            value={notes}
            onChange={(e) =>
              dispatch({ type: "SET_FIELD", field: "notes", value: e.target.value })
            }
            className="border rounded-md p-2 w-full"
            rows={3}
            placeholder="Additional notes"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-md w-full"
        >
          Generate Invoice
        </button>
      </div>

      {/* Right Side: Invoice Preview */}
      <div id="invoice-preview" className="w-full sm:w-7/10 p-4 bg-white shadow-md rounded-md">
        {/* Invoice Preview Content */}
        <h2 className="text-2xl font-bold mb-4">Invoice Preview</h2>
        <p><strong>Customer:</strong> {selectedCustomer}</p>
        <p><strong>Invoice Date:</strong> {invoiceDate?.toLocaleDateString()}</p>
        <p><strong>Due Date:</strong> {dueDate?.toLocaleDateString()}</p>
        <p><strong>Status:</strong> {status}</p>
        <ul>
          {selectedProducts.map((product) => (
            <li key={product.name}>
              {product.name} - {product.quantity} x ${product.price}
            </li>
          ))}
        </ul>
        <p><strong>Tax:</strong> {tax}%</p>
        <p><strong>Total Amount:</strong> ${totalAmount}</p>
        <p><strong>Notes:</strong> {notes}</p>
        {signature && <p><strong>Signature:</strong> {signature.name}</p>}
      </div>
    </form>
  );
};

export default NewInvoiceBox;

// import React, { useReducer } from "react";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { v4 as uuidv4 } from "uuid";

// // Define the state type
// interface State {
//   selectedCustomer: string | null;
//   selectedProducts: { name: string; price: number; quantity: number }[];
//   dueDate: Date | null;
//   invoiceDate: Date | null;
//   status: string;
//   signature: File | null;
//   notes: string;
// }

// // Define the action types
// type Action =
//   | { type: "SET_FIELD"; field: string; value: any }
//   | { type: "ADD_PRODUCT"; product: { name: string; price: number } }
//   | { type: "REMOVE_PRODUCT"; productName: string }
//   | { type: "UPDATE_PRODUCT_QTY"; productName: string; quantity: number };

// // Initialize the state
// const initialState: State = {
//   selectedCustomer: null,
//   selectedProducts: [],
//   dueDate: null,
//   invoiceDate: null,
//   status: "Pending",
//   signature: null,
//   notes: "",
// };

// // Reducer function
// const reducer = (state: State, action: Action): State => {
//   switch (action.type) {
//     case "SET_FIELD":
//       return { ...state, [action.field]: action.value };
//     case "ADD_PRODUCT":
//       return state.selectedProducts.some(
//         (product) => product.name === action.product.name
//       )
//         ? state
//         : {
//             ...state,
//             selectedProducts: [
//               ...state.selectedProducts,
//               { ...action.product, quantity: 1 },
//             ],
//           };
//     case "REMOVE_PRODUCT":
//       return {
//         ...state,
//         selectedProducts: state.selectedProducts.filter(
//           (product) => product.name !== action.productName
//         ),
//       };
//     case "UPDATE_PRODUCT_QTY":
//       return {
//         ...state,
//         selectedProducts: state.selectedProducts.map((product) =>
//           product.name === action.productName
//             ? { ...product, quantity: action.quantity }
//             : product
//         ),
//       };
//     default:
//       return state;
//   }
// };

// const NewInvoiceBox = () => {
//   const [state, dispatch] = useReducer(reducer, initialState);
//   const { selectedCustomer, selectedProducts, dueDate, invoiceDate, status, signature, notes } =
//     state;

//   const customers = [
//     { name: "John Doe", address: "123 Main St, City, State, 12345" },
//     { name: "Jane Smith", address: "456 Oak Ave, City, State, 67890" },
//   ];

//   const products = [
//     { name: "Product1", price: 100 },
//     { name: "Product2", price: 200 },
//     { name: "Product3", price: 300 },
//   ];

//   const totalAmount = selectedProducts.reduce(
//     (total, product) => total + product.price * product.quantity,
//     0
//   );

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!selectedCustomer || selectedProducts.length === 0 || !dueDate || !invoiceDate) {
//       alert("Please fill in all required fields.");
//       return;
//     }

//     const invoiceData = {
//       ...state,
//       totalAmount,
//       invoiceId: uuidv4(),
//     };

//     console.log(invoiceData);
//   };

//   return (
//     <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row w-full">
//       {/* Left Side: Form */}
//       <div className="w-full sm:w-1/2 p-4 bg-white shadow-md rounded-md">
//         <div className="mb-4">
//           <label className="block text-gray-700">Customer Name</label>
//           <select
//             value={selectedCustomer || ""}
//             onChange={(e) =>
//               dispatch({
//                 type: "SET_FIELD",
//                 field: "selectedCustomer",
//                 value: e.target.value ? e.target.value : null,
//               })
//             }
//             className="border rounded-md p-2 w-full"
//           >
//             <option value="">Select Customer</option>
//             {customers.map((customer) => (
//               <option key={customer.name} value={customer.name}>
//                 {customer.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="mb-4">
//           <label className="block text-gray-700">Products</label>
//           <select
//             onChange={(e) =>
//               dispatch({
//                 type: "ADD_PRODUCT",
//                 product: products.find((p) => p.name === e.target.value)!,
//               })
//             }
//             className="border rounded-md p-2 w-full"
//           >
//             <option value="">Select Product</option>
//             {products
//               .filter((product) => !selectedProducts.some((p) => p.name === product.name))
//               .map((product) => (
//                 <option key={product.name} value={product.name}>
//                   {product.name}
//                 </option>
//               ))}
//           </select>

//           <div className="mt-2">
//             {selectedProducts.map((product) => (
//               <div
//                 key={product.name}
//                 className="flex justify-between items-center border rounded-md p-2 mt-2"
//               >
//                 <span>{product.name} (Qty: {product.quantity})</span>
//                 <input
//                   type="number"
//                   min="1"
//                   value={product.quantity}
//                   onChange={(e) =>
//                     dispatch({
//                       type: "UPDATE_PRODUCT_QTY",
//                       productName: product.name,
//                       quantity: parseInt(e.target.value, 10),
//                     })
//                   }
//                   className="w-16 ml-4 border rounded-md p-1"
//                 />
//                 <button
//                   onClick={() => dispatch({ type: "REMOVE_PRODUCT", productName: product.name })}
//                   className="text-red-500 ml-4"
//                 >
//                   Remove
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="mb-4">
//           <label className="block text-gray-700">Due Date</label>
//           <DatePicker
//             selected={dueDate}
//             onChange={(date) => dispatch({ type: "SET_FIELD", field: "dueDate", value: date })}
//             className="border rounded-md p-2 w-full"
//             placeholderText="Select Due Date"
//           />
//         </div>

//         <div className="mb-4">
//           <label className="block text-gray-700">Invoice Date</label>
//           <DatePicker
//             selected={invoiceDate}
//             onChange={(date) => dispatch({ type: "SET_FIELD", field: "invoiceDate", value: date })}
//             className="border rounded-md p-2 w-full"
//             placeholderText="Select Invoice Date"
//           />
//         </div>

//         <div className="mb-4">
//           <label className="block text-gray-700">Status</label>
//           <select
//             value={status}
//             onChange={(e) =>
//               dispatch({ type: "SET_FIELD", field: "status", value: e.target.value })
//             }
//             className="border rounded-md p-2 w-full"
//           >
//             <option value="Pending">Pending</option>
//             <option value="Paid">Paid</option>
//             <option value="Overdue">Overdue</option>
//           </select>
//         </div>

//         <div className="mb-4">
//           <label className="block text-gray-700">Signature</label>
//           <input
//             type="file"
//             onChange={(e) =>
//               dispatch({ type: "SET_FIELD", field: "signature", value: e.target.files![0] })
//             }
//             className="border rounded-md p-2 w-full"
//           />
//         </div>

//         <div className="mb-4">
//           <label className="block text-gray-700">Notes/Comments</label>
//           <textarea
//             value={notes}
//             onChange={(e) => dispatch({ type: "SET_FIELD", field: "notes", value: e.target.value })}
//             className="border rounded-md p-2 w-full"
//             placeholder="Enter any notes or comments"
//           />
//         </div>

//         <button type="submit" className="bg-blue-500 text-white p-2 rounded-md w-full">
//           Create Invoice
//         </button>
//       </div>

//       {/* Right Side: Invoice Preview */}
//       <div className="w-full sm:w-1/2 p-6 bg-gray-100 shadow-lg rounded-md">
//         <div className="bg-white p-6 shadow-md rounded-lg">
//           <div className="text-xl font-bold mb-4 text-center">#INVOICE</div>
//           <div className="flex justify-center mb-4">
//             <img src="https://c8.alamy.com/comp/2ATDJ0A/initial-letter-ka-logo-design-vector-template-abstract-letter-ka-linked-logo-design-2ATDJ0A.jpg" alt="Company Logo" className="w-16 h-16" />
//           </div>
//           <div className="text-gray-700 mb-4">
//             <div>Company Name</div>
//             <div>123 Company Address, City, State, ZIP</div>
//             <div>GST: 1234567890</div>
//           </div>
//           <hr className="my-4" />
//           <div className="text-gray-700 mb-4">
//             <div>Billing to:</div>
//             <div>{selectedCustomer}</div>
//             <div>
//               {customers.find((c) => c.name === selectedCustomer)?.address}
//             </div>
//           </div>
//           <div className="mt-4 text-right text-gray-700 mb-4">
//             <div>Invoice ID: INV-001</div>
//             <div>Invoice Date: {invoiceDate?.toLocaleDateString()}</div>
//             <div>Due Date: {dueDate?.toLocaleDateString()}</div>
//           </div>
//           <hr className="my-4" />
//           <table className="w-full text-left">
//             <thead>
//               <tr>
//                 <th>S.no</th>
//                 <th>Product</th>
//                 <th>Qty</th>
//                 <th>Price</th>
//                 <th>Total</th>
//               </tr>
//             </thead>
//             <tbody>
//               {selectedProducts.map((product, index) => (
//                 <tr key={product.name}>
//                   <td>{index + 1}</td>
//                   <td>{product.name}</td>
//                   <td>{product.quantity}</td>
//                   <td>${product.price}</td>
//                   <td>${(product.price * product.quantity).toFixed(2)}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           <div className="mt-4 text-right">
//             <div>Subtotal: ${totalAmount.toFixed(2)}</div>
//             <div>Tax (18%): ${(totalAmount * 0.18).toFixed(2)}</div>
//             <div className="text-lg font-bold">
//               Total: ${(totalAmount * 1.18).toFixed(2)}
//             </div>
//           </div>

//           <div className="mt-8 text-right">
//             Signature: {signature ? <img src={URL.createObjectURL(signature)} alt="Signature" /> : "______________"}
//           </div>

//           <div className="mt-8">
//             Notes: {notes}
//           </div>
//         </div>
//       </div>
//     </form>
//   );
// };

// export default NewInvoiceBox;

