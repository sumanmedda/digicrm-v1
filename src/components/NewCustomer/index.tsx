'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const NewCustomerBox = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [demoCustomer, setDemoCustomer] = useState({});
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    const newCustomerData = {"name":name, "email":email, "phone":phone, "address":address}
    setDemoCustomer(newCustomerData)
    localStorage.setItem('newCustomer',  JSON.stringify(newCustomerData))
  };

  const handleBackClick = () => {
    router.back();
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-md shadow-md dark:bg-gray-dark">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Create New Customer</h2>
        <button
          onClick={handleBackClick}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring focus:ring-gray-300"
        >
          Back
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-white font-medium mb-2" htmlFor="name">
            Customer Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            placeholder="Enter customer name"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-white font-medium mb-2" htmlFor="email">
            Customer Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            placeholder="Enter customer email"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-white font-medium mb-2" htmlFor="phone">
            Customer Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            placeholder="Enter customer phone number"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 dark:text-white font-medium mb-2" htmlFor="address">
            Customer Address
          </label>
          <textarea
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            placeholder="Enter customer address"
            rows={4}
            required
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewCustomerBox;
