'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TiDeleteOutline } from "react-icons/ti";
import { HiOutlineClipboardCopy } from "react-icons/hi";

const initialCustomerData = [
  { customerId: "CSTR-001", name: "John Doe", email: "john.doe@example.com", phone: "123-456-7890" },
  { customerId: "CSTR-002", name: "Jane Smith", email: "jane.smith@example.com", phone: "234-567-8901" },
  { customerId: "CSTR-003", name: "Tom Johnson", email: "tom.johnson@example.com", phone: "345-678-9012" },
  { customerId: "CSTR-004", name: "Emily Davis", email: "emily.davis@example.com", phone: "456-789-0123" },
  { customerId: "CSTR-005", name: "Michael Brown", email: "michael.brown@example.com", phone: "567-890-1234" },
  { customerId: "CSTR-006", name: "Chris Wilson", email: "chris.wilson@example.com", phone: "678-901-2345" },
  { customerId: "CSTR-007", name: "Laura Miller", email: "laura.miller@example.com", phone: "789-012-3456" },
  { customerId: "CSTR-008", name: "Kevin Garcia", email: "kevin.garcia@example.com", phone: "890-123-4567" },
  { customerId: "CSTR-009", name: "Sarah Moore", email: "sarah.moore@example.com", phone: "901-234-5678" },
  { customerId: "CSTR-010", name: "Daniel Taylor", email: "daniel.taylor@example.com", phone: "012-345-6789" },
];

const CustomerBox = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [customers, setCustomers] = useState(initialCustomerData);
  const itemsPerPage = 5;

  const handleDelete = (customerId: string) => {
    const updatedCustomers = customers.filter(customer => customer.customerId !== customerId);
    setCustomers(updatedCustomers);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const filteredCustomers = customers.filter((customer) => {
    return (
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm)
    );
  });

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="rounded-[10px] bg-white px-4 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      
      {/* Add Customer Button */}
      <div className="mb-5.5">
        <button
          onClick={() => router.push("/pages/newcustomer")}
          className="px-4 py-2 border border-green-500 rounded-md bg-green-500 text-white hover:bg-green-600 w-full sm:w-auto"
        >
          Add Customer
        </button>
      </div>

      {/* Search */}
      <div className="mb-5.5">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 p-2 rounded-md w-full"
        />
      </div>

      {/* Customers Table */}
      <div className="overflow-x-auto">
        <div className="min-w-[500px] grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4">
          <div className="px-2 pb-3.5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Name
            </h5>
          </div>
          <div className="px-2 pb-3.5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Email
            </h5>
          </div>
          <div className="px-2 pb-3.5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Phone
            </h5>
          </div>
          <div className="px-2 pb-3.5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Action
            </h5>
          </div>
        </div>

        {paginatedCustomers.map((customer) => (
          <div
            className="grid min-w-[500px] grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4 border-b border-stroke dark:border-dark-3 cursor-pointer"
            key={customer.customerId}
            onClick={() => router.push(`/pages/customer/${customer.customerId}`)}
          >
            <div className="flex items-center px-2 py-4">
              <p className="font-medium text-dark dark:text-white">
                {customer.name}
              </p>
            </div>

            <div className="flex items-center px-2 py-4">
              <p className="font-medium text-dark dark:text-white">
                {customer.email}
              </p>
              <button
                onClick={(e) => { e.stopPropagation(); handleCopy(customer.email); }}
                className="ml-2"
              >
                <HiOutlineClipboardCopy className="text-gray-500" />
              </button>
            </div>

            <div className="flex items-center px-2 py-4">
              <p className="font-medium text-dark dark:text-white">
                {customer.phone}
              </p>
              <button
                onClick={(e) => { e.stopPropagation(); handleCopy(customer.phone); }}
                className="ml-2"
              >
                <HiOutlineClipboardCopy className="text-gray-500" />
              </button>
            </div>

            <div className="flex items-center justify-center px-2 py-4">
              <button
                onClick={(e) => { e.stopPropagation(); handleDelete(customer.customerId); }}
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

export default CustomerBox;


// 'use client';

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { TiDeleteOutline } from "react-icons/ti";
// import { FiCopy } from "react-icons/fi";

// const initialCustomerData = [
//   { customerId: "CSTR-001", name: "John Doe", email: "john.doe@example.com", phone: "+1234567890" },
//   { customerId: "CSTR-002", name: "Jane Smith", email: "jane.smith@example.com", phone: "+0987654321" },
//   { customerId: "CSTR-003", name: "Tom Johnson", email: "tom.johnson@example.com", phone: "+1122334455" },
//   { customerId: "CSTR-004", name: "Emily Davis", email: "emily.davis@example.com", phone: "+2233445566" },
//   { customerId: "CSTR-005", name: "Michael Brown", email: "michael.brown@example.com", phone: "+3344556677" },
// ];

// const CustomerBox = () => {
//   const router = useRouter();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [customers, setCustomers] = useState(initialCustomerData);
//   const itemsPerPage = 5;

//   const handleDelete = (customerId: string) => {
//     const updatedCustomers = customers.filter(customer => customer.customerId !== customerId);
//     setCustomers(updatedCustomers);
//   };

//   const handleCopy = (text: string) => {
//     navigator.clipboard.writeText(text);
//   };

//   const filteredCustomers = customers.filter((customer) =>
//     customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     customer.phone.includes(searchTerm)
//   );

//   const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
//   const paginatedCustomers = filteredCustomers.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   const handleRowClick = (customerId: string) => {
//     router.push(`/pages/customer/${customerId}`);
//   };

//   return (
//     <div className="rounded-[10px] bg-white px-4 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      
//       {/* Add Customer Button */}
//       <div className="mb-5.5">
//         <button
//           onClick={() => router.push("/pages/newcustomer")}
//           className="px-4 py-2 border border-green-500 rounded-md bg-green-500 text-white hover:bg-green-600 w-full sm:w-auto"
//         >
//           Add Customer
//         </button>
//       </div>

//       {/* Search */}
//       <div className="flex items-center mb-5.5">
//         <input
//           type="text"
//           placeholder="Search..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="border border-gray-300 p-2 rounded-md w-full"
//         />
//       </div>

//       {/* Customers Table */}
//       <div className="overflow-x-auto">
//         <div className="min-w-[500px] grid grid-cols-4">
//           <div className="px-2 pb-3.5">
//             <h5 className="text-sm font-medium uppercase xsm:text-base">
//               Customer Name
//             </h5>
//           </div>
//           <div className="px-2 pb-3.5 text-center">
//             <h5 className="text-sm font-medium uppercase xsm:text-base">
//               Email
//             </h5>
//           </div>
//           <div className="px-2 pb-3.5 text-center">
//             <h5 className="text-sm font-medium uppercase xsm:text-base">
//               Phone
//             </h5>
//           </div>
//           <div className="px-2 pb-3.5 text-center">
//             <h5 className="text-sm font-medium uppercase xsm:text-base">
//               Action
//             </h5>
//           </div>
//         </div>

//         {paginatedCustomers.map((customer) => (
//           <div
//             className={`grid min-w-[500px] grid-cols-4 border-b border-stroke dark:border-dark-3 cursor-pointer`}
//             key={customer.customerId}
//             onClick={() => handleRowClick(customer.customerId)}
//           >
//             <div className="flex items-center gap-3.5 px-2 py-4">
//               <p className="font-medium text-dark dark:text-white">
//                 {customer.name}
//               </p>
//             </div>

//             <div className="flex items-center justify-center px-2 py-4">
//               <p className="font-medium text-dark dark:text-white">
//                 {customer.email}
//               </p>
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleCopy(customer.email);
//                 }}
//                 className="ml-2 text-gray-500 hover:text-gray-700"
//               >
//                 <FiCopy />
//               </button>
//             </div>

//             <div className="flex items-center justify-center px-2 py-4">
//               <p className="font-medium text-dark dark:text-white">
//                 {customer.phone}
//               </p>
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleCopy(customer.phone);
//                 }}
//                 className="ml-2 text-gray-500 hover:text-gray-700"
//               >
//                 <FiCopy />
//               </button>
//             </div>

//             <div className="flex items-center justify-center px-2 py-4">
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleDelete(customer.customerId);
//                 }}
//                 className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Pagination */}
//       <div className="flex justify-between items-center mt-4">
//         <button
//           onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//           disabled={currentPage === 1}
//           className="px-3 py-1 border border-gray-300 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
//         >
//           Previous
//         </button>

//         <span>
//           Page {currentPage} of {totalPages}
//         </span>

//         <button
//           onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//           disabled={currentPage === totalPages}
//           className="px-3 py-1 border border-gray-300 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CustomerBox;
