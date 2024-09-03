'use client';

import React, { useReducer } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { v4 as uuidv4 } from "uuid";

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
  const [state, dispatch] = useReducer(reducer, initialState);
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
            <img
              src="https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg"
              alt="Company Logo"
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
                  ${product.price * product.quantity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Subtotal, Tax, and Total (Centered in an Invisible Table) */}
        <div className="flex justify-end mb-4">
          <table className="text-center">
            <tbody>
              <tr className="invisible">
                <td className="p-2">Invisible</td>
              </tr>
              <tr>
                <td className="p-2">Subtotal:</td>
                <td className="p-2">${totalAmount.toFixed(2)}</td>
              </tr>
              <tr>
                <td className="p-2">Tax (%):</td>
                <td className="p-2">
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
                <td className="p-2">Tax Amount:</td>
                <td className="p-2">${taxAmount.toFixed(2)}</td>
              </tr>
              <tr>
                <td className="text-lg font-bold p-1">Total:</td>
                <td className="text-lg font-bold p-1">${grandTotal.toFixed(2)}</td>
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
      </div>
    </form>
  );
};

export default NewInvoiceBox;



// 'use client';

// import React, { useReducer } from "react";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { v4 as uuidv4 } from "uuid";

// interface State {
//   selectedCustomer: string | null;
//   selectedProducts: { name: string; price: number; quantity: number }[];
//   dueDate: Date | null;
//   invoiceDate: Date | null;
//   status: string;
//   signature: string | null;
//   notes: string;
//   tax: number;
//   signatureType: string;
//   uploadedSignatures: string[];
// }

// type Action =
//   | { type: "SET_FIELD"; field: keyof State; value: any }
//   | { type: "ADD_PRODUCT"; product: { name: string; price: number } }
//   | { type: "REMOVE_PRODUCT"; productName: string }
//   | { type: "UPDATE_PRODUCT_QTY"; productName: string; quantity: number }
//   | { type: "UPLOAD_SIGNATURE"; signature: string };

// const initialState: State = {
//   selectedCustomer: null,
//   selectedProducts: [],
//   dueDate: null,
//   invoiceDate: null,
//   status: "Pending",
//   signature: null,
//   notes: "",
//   tax: 18,
//   signatureType: "",
//   uploadedSignatures: [],
// };

// const reducer = (state: State, action: Action): State => {
//   switch (action.type) {
//     case "SET_FIELD":
//       return {
//         ...state,
//         [action.field]: action.field === "tax" && action.value < 0 ? 0 : action.value,
//       };
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
//     case "UPLOAD_SIGNATURE":
//       return {
//         ...state,
//         signature: action.signature,
//       };
//     default:
//       return state;
//   }
// };

// const NewInvoiceBox = () => {
//   const [state, dispatch] = useReducer(reducer, initialState);
//   const {
//     selectedCustomer,
//     selectedProducts,
//     dueDate,
//     invoiceDate,
//     status,
//     signature,
//     notes,
//     tax,
//     signatureType,
//   } = state;

//   const customers = [
//     { name: "John Doe", address: "123 Main St, City, State, 12345", gst: "GST12345" },
//     { name: "Jane Smith", address: "456 Oak Ave, City, State, 67890", gst: "GST67890" },
//   ];

//   const products = [
//     { name: "Product1", price: 100 },
//     { name: "Product2", price: 200 },
//     { name: "Product3", price: 300 },
//   ];

//   const uploadedSignatures = ["Signature1", "Signature2", "Signature3"];

//   const totalAmount = selectedProducts.reduce(
//     (total, product) => total + product.price * product.quantity,
//     0
//   );

//   const taxAmount = (totalAmount * tax) / 100;
//   const grandTotal = totalAmount + taxAmount;

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
//       {/* Right Side: Invoice Preview */}
//       <div
//         id="invoice-preview"
//         className="w-full sm:w-7/10 p-4 bg-white shadow-md rounded-md"
//       >
//         {/* Customer and Billing */}
//         <div className="mb-4 custom-invoice-frombill">
//           <div>
//             <img
//               src="https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg"
//               alt="Company Logo"
//               className="w-22"
//             />
//             <h1 className="text-3xl font-bold">INVOICE - INV001</h1>
//             <div className="pt-12 custom-billing-from-to">
//               <div>
//                 <div>
//                   <p className="font-bold">From:</p>
//                   <p>Company Name</p>
//                   <p>Company Address</p>
//                   <p>GST: Company GST</p>
//                 </div>
                
//               </div>
//             </div>
//           </div>
//           <div>
//                   <p className="font-bold">Billing to:</p>
//                   <select
//                     value={selectedCustomer || ""}
//                     onChange={(e) =>
//                       dispatch({ type: "SET_FIELD", field: "selectedCustomer", value: e.target.value })
//                     }
//                     className="w-full p-2 border rounded-md"
//                   >
//                   <option value="" disabled>Select Customer</option>
//                   {customers.map((customer) => (
//                     <option key={customer.name} value={customer.name}>
//                       {customer.name}
//                     </option>
//                   ))}
//                   </select>
//                   <p>{selectedCustomer ? customers.find(c => c.name === selectedCustomer)?.address : "Customer Address"}</p>
//                 </div>
//         </div>
        

//         {/* Invoice and Due Dates */}
//         <div className="text-right flex justify-between mb-4">
//           <div>
//             <p className="text-lg">
//               <span className="font-bold">Invoice Date:</span>
//               <DatePicker
//                 selected={invoiceDate}
//                 onChange={(date) => dispatch({ type: "SET_FIELD", field: "invoiceDate", value: date })}
//                 dateFormat="MM/dd/yyyy"
//                 className="ml-2 p-1 border rounded-md"
//               />
//             </p>
//             <p className="text-lg pb-10">
//               <span className="font-bold">Due Date:</span>
//               <DatePicker
//                 selected={dueDate}
//                 onChange={(date) => dispatch({ type: "SET_FIELD", field: "dueDate", value: date })}
//                 dateFormat="MM/dd/yyyy"
//                 className="ml-2 p-1 border rounded-md"
//               />
//             </p>
//           </div>
//         </div>

//         {/* Products */}
//         <div className="flex items-center mb-4">
//           <select
//             onChange={(e) =>
//               dispatch({
//                 type: "ADD_PRODUCT",
//                 product: products.find((p) => p.name === e.target.value)!,
//               })
//             }
//             className="w-full p-2 border rounded-md"
//           >
//             <option value="" disabled>Select Product</option>
//             {products.map((product) => (
//               <option key={product.name} value={product.name}>
//                 {product.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         <table className="w-full mb-4">
//           <thead>
//             <tr>
//               <th className="border px-2 py-1">S.no</th>
//               <th className="border px-2 py-1">Products</th>
//               <th className="border px-2 py-1">Qty</th>
//               <th className="border px-2 py-1">Price</th>
//             </tr>
//           </thead>
//           <tbody>
//             {selectedProducts.map((product, index) => (
//               <tr key={index}>
//                 <td className="border px-2 py-1 text-center">{index + 1}</td>
//                 <td className="border px-2 py-1 text-center">{product.name}</td>
//                 <td className="border px-2 py-1 text-center">
//                   <input
//                     type="number"
//                     value={product.quantity}
//                     onChange={(e) =>
//                       dispatch({
//                         type: "UPDATE_PRODUCT_QTY",
//                         productName: product.name,
//                         quantity: parseInt(e.target.value),
//                       })
//                     }
//                     className="w-full text-center p-1 border rounded-md"
//                   />
//                 </td>
//                 <td className="border px-2 py-1 text-center">${product.price * product.quantity}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {/* Subtotal, Tax, and Total */}
//         <div className="text-right mb-4">
//           <p>Subtotal: ${totalAmount.toFixed(2)}</p>
//           <p>
//             Tax (%):
//             <input
//               type="number"
//               value={tax}
//               onChange={(e) =>
//                 dispatch({ type: "SET_FIELD", field: "tax", value: parseInt(e.target.value) })
//               }
//               className="w-16 text-right p-1 border rounded-md ml-2"
//             />
//           </p>
//           <p>Tax Amount: ${taxAmount.toFixed(2)}</p>
//           <p className="text-xl font-bold">Total: ${grandTotal.toFixed(2)}</p>
//         </div>

//         {/* Authorized Signature */}
//         <div className="text-right mt-8">
//           <p>Authorized Signature:</p>
//           <select
//             value={signature || ""}
//             onChange={(e) =>
//               dispatch({ type: "UPLOAD_SIGNATURE", signature: e.target.value })
//             }
//             className="w-full p-2 border rounded-md"
//           >
//             <option value="" disabled>Select Signature</option>
//             {uploadedSignatures.map((sig, index) => (
//               <option key={index} value={sig}>
//                 {sig}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Notes */}
//         <div className="mt-8 w-full">
//           <p>Notes:</p>
//           <textarea
//             value={notes}
//             onChange={(e) => dispatch({ type: "SET_FIELD", field: "notes", value: e.target.value })}
//             className="w-full p-2 border rounded-md"
//           />
//         </div>
//       </div>
//     </form>
//   );
// };

// export default NewInvoiceBox;


// 'use client';

// import React, { useReducer } from "react";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { v4 as uuidv4 } from "uuid";


// interface State {
//   selectedCustomer: string | null;
//   selectedProducts: { name: string; price: number; quantity: number }[];
//   dueDate: Date | null;
//   invoiceDate: Date | null;
//   status: string;
//   signature: File | null;
//   notes: string;
//   tax: number;
//   signatureType: string;
//   uploadedSignatures: File[];
// }

// type Action =
//   | { type: "SET_FIELD"; field: keyof State; value: any }
//   | { type: "ADD_PRODUCT"; product: { name: string; price: number } }
//   | { type: "REMOVE_PRODUCT"; productName: string }
//   | { type: "UPDATE_PRODUCT_QTY"; productName: string; quantity: number }
//   | { type: "UPLOAD_SIGNATURE"; signature: File };

// const initialState: State = {
//   selectedCustomer: null,
//   selectedProducts: [],
//   dueDate: null,
//   invoiceDate: null,
//   status: "Pending",
//   signature: null,
//   notes: "",
//   tax: 18,
//   signatureType: "",
//   uploadedSignatures: [],
// };

// const reducer = (state: State, action: Action): State => {
//   switch (action.type) {
//     case "SET_FIELD":
//       return {
//         ...state,
//         [action.field]: action.field === "tax" && action.value < 0 ? 0 : action.value,
//       };
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
//     case "UPLOAD_SIGNATURE":
//       return {
//         ...state,
//         uploadedSignatures: [...state.uploadedSignatures, action.signature],
//       };
//     default:
//       return state;
//   }
// };

// const NewInvoiceBox = () => {
//   const [state, dispatch] = useReducer(reducer, initialState);
//   const {
//     selectedCustomer,
//     selectedProducts,
//     dueDate,
//     invoiceDate,
//     status,
//     signature,
//     notes,
//     tax,
//     signatureType,
//     uploadedSignatures,
//   } = state;

//   const customers = [
//     { name: "John Doe", address: "123 Main St, City, State, 12345", gst: "GST12345" },
//     { name: "Jane Smith", address: "456 Oak Ave, City, State, 67890", gst: "GST67890" },
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

//   const taxAmount = (totalAmount * tax) / 100;
//   const grandTotal = totalAmount + taxAmount;

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
//       <div className="w-full sm:w-3/10 p-4 bg-white shadow-md rounded-md">
//         <h2 className="text-lg font-bold mb-4">Invoice Details</h2>
        
//         <div className="mb-4">
//           <label className="block text-sm font-medium mb-1">Customer</label>
//           <select
//             value={selectedCustomer || ""}
//             onChange={(e) =>
//               dispatch({ type: "SET_FIELD", field: "selectedCustomer", value: e.target.value })
//             }
//             className="w-full p-2 border rounded-md"
//           >
//             <option value="" disabled>Select Customer</option>
//             {customers.map((customer) => (
//               <option key={customer.name} value={customer.name}>
//                 {customer.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="mb-4">
//           <label className="block text-sm font-medium mb-1">Products</label>
//           <select
//             onChange={(e) => {
//               const selectedProduct = products.find(p => p.name === e.target.value);
//               if (selectedProduct) {
//                 dispatch({ type: "ADD_PRODUCT", product: selectedProduct });
//               }
//             }}
//             className="w-full p-2 border rounded-md"
//             value=""
//           >
//             <option value="" disabled>Select Product</option>
//             {products.map((product) => (
//               <option key={product.name} value={product.name}>
//                 {product.name} - ${product.price}
//               </option>
//             ))}
//           </select>

//           {/* List selected products with quantity and remove option */}
//           {selectedProducts.map((product, index) => (
//             <div key={index} className="flex items-center justify-between mt-2">
//               <span>{product.name}</span>
//               <input
//                 type="number"
//                 value={product.quantity}
//                 onChange={(e) =>
//                   dispatch({
//                     type: "UPDATE_PRODUCT_QTY",
//                     productName: product.name,
//                     quantity: parseInt(e.target.value, 10),
//                   })
//                 }
//                 className="w-16 p-1 border rounded-md"
//                 min={1}
//               />
//               <button
//                 type="button"
//                 onClick={() =>
//                   dispatch({ type: "REMOVE_PRODUCT", productName: product.name })
//                 }
//                 className="text-red-500"
//               >
//                 Remove
//               </button>
//             </div>
//           ))}
//         </div>
        
//         <div className="mb-4">
//           <label className="block text-sm font-medium mb-1">Invoice Date</label>
//           <DatePicker
//             selected={invoiceDate}
//             onChange={(date) =>
//               dispatch({ type: "SET_FIELD", field: "invoiceDate", value: date })
//             }
//             className="w-full p-2 border rounded-md"
//             dateFormat="yyyy-MM-dd"
//           />
//         </div>
        
//         <div className="mb-4">
//           <label className="block text-sm font-medium mb-1">Due Date</label>
//           <DatePicker
//             selected={dueDate}
//             onChange={(date) =>
//               dispatch({ type: "SET_FIELD", field: "dueDate", value: date })
//             }
//             className="w-full p-2 border rounded-md"
//             dateFormat="yyyy-MM-dd"
//           />
//         </div>
        
//         <div className="mb-4">
//           <label className="block text-sm font-medium mb-1">Status</label>
//           <select
//             value={status}
//             onChange={(e) =>
//               dispatch({ type: "SET_FIELD", field: "status", value: e.target.value })
//             }
//             className="w-full p-2 border rounded-md"
//           >
//             <option value="Pending">Pending</option>
//             <option value="Paid">Paid</option>
//             <option value="Overdue">Overdue</option>
//           </select>
//         </div>

//         <div className="mb-4">
//           <label className="block text-sm font-medium mb-1">Tax (%)</label>
//           <input
//             type="number"
//             value={tax}
//             onChange={(e) =>
//               dispatch({ type: "SET_FIELD", field: "tax", value: parseFloat(e.target.value) })
//             }
//             className="w-full p-2 border rounded-md"
//             min={0}
//           />
//         </div>

//         <div className="mb-4">
//           <label className="block text-sm font-medium mb-1">Upload Signature</label>
//           <input
//             type="file"
//             onChange={(e) => {
//               const file = e.target.files?.[0];
//               if (file) {
//                 dispatch({ type: "UPLOAD_SIGNATURE", signature: file });
//               }
//             }}
//             className="w-full p-2 border rounded-md"
//           />
//         </div>

//         <div className="mb-4">
//           <label className="block text-sm font-medium mb-1">Signature</label>
//           <select
//             value={signatureType}
//             onChange={(e) =>
//               dispatch({ type: "SET_FIELD", field: "signatureType", value: e.target.value })
//             }
//             className="w-full p-2 border rounded-md"
//           >
//             <option value="">Select Signature</option>
//             {uploadedSignatures.map((signature, index) => (
//               <option key={index} value={signature.name}>
//                 {signature.name}
//               </option>
//             ))}
//           </select>
//         </div>

        

//         <div className="mb-4">
//           <label className="block text-sm font-medium mb-1">Notes</label>
//           <textarea
//             value={notes}
//             onChange={(e) =>
//               dispatch({ type: "SET_FIELD", field: "notes", value: e.target.value })
//             }
//             className="w-full p-2 border rounded-md"
//             rows={4}
//           />
//         </div>

//         <button
//           type="submit"
//           className="w-full py-2 bg-blue-600 text-white rounded-md"
//         >
//           Generate Invoice
//         </button>
//       </div>

//       {/* Right Side: Invoice Preview */}
//       <div
//         id="invoice-preview"
//         className="w-full sm:w-7/10 p-4 bg-white shadow-md rounded-md"
//       > 
//         <div className="mb-4 custom-invoice-frombill">
//             <div>
//                 <img src="https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg" alt="Company Logo" className="w-22" />
//                 <h1 className="text-3xl font-bold">INVOICE - INV001</h1>
//                 <div className="pt-12">
//                     <p className="font-bold">From:</p>
//                     <p>Company Name</p>
//                     <p>Company Address</p>
//                     <p>GST: Company GST</p>
//                 </div>
//             </div>
//             <div>
//                 <p className="font-bold">Billing to:</p>
//                 <p>{selectedCustomer || "Customer Name"}</p>
//                 <p className="pb-7">{selectedCustomer ? customers.find(c => c.name === selectedCustomer)?.address : "Customer Address"}</p>
//             </div>
//         </div>

//         <div className="text-right flex justify-between mb-4">
//           <div className="">
//             <p className="text-lg"><span className="font-bold">Invoice Date:</span> {invoiceDate ? invoiceDate.toLocaleDateString() : "Date"}</p>
//             <p className="text-lg pb-10"><span className="font-bold">Due Date:</span> {dueDate ? dueDate.toLocaleDateString() : "Date"}</p>
//           </div>
//         </div>

//         <table className="w-full mb-4">
//           <thead>
//             <tr>
//               <th className="border px-2 py-1">S.no</th>
//               <th className="border px-2 py-1">Products</th>
//               <th className="border px-2 py-1">Qty</th>
//               <th className="border px-2 py-1">Price</th>
//             </tr>
//           </thead>
//           <tbody>
//             {selectedProducts.map((product, index) => (
//               <tr key={index}>
//                 <td className="border px-2 py-1 text-center">{index + 1}</td>
//                 <td className="border px-2 py-1 text-center">{product.name}</td>
//                 <td className="border px-2 py-1 text-center">{product.quantity}</td>
//                 <td className="border px-2 py-1 text-center">${product.price * product.quantity}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         <div className="text-right mb-4 pt-21">
//           <p>Subtotal: ${totalAmount.toFixed(2)}</p>
//           <p>Tax ({tax}%): ${taxAmount.toFixed(2)}</p>
//           <p className="text-xl font-bold">Total: ${grandTotal.toFixed(2)}</p>
//         </div>

//         <div className="text-right mt-8">
//           <p>Authorized Signature:</p>
//           <p>{signatureType || "Signature"}</p>
//         </div>

//         <div className="mt-8">
//           <p>Notes:</p>
//           <p>{notes || "No additional notes."}</p>
//         </div>
//       </div>
//     </form>
//   );
// };

// export default NewInvoiceBox; 