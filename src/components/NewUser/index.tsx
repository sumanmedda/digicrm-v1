'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

const NewUserBox = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({
      name,
      email,
      phone,
      address,
    });
  };

  const items = [
    {
      key: "user",
      label: "User",
    },
    {
      key: "admin",
      label: "Admin",
    },
    {
      key: "superadmin",
      label: "Super Admin",
    },
  ];

  const handleBackClick = () => {
    router.back();
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-md shadow-md dark:bg-gray-dark">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Create New User</h2>
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
            User Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            placeholder="Enter User name"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-white font-medium mb-2" htmlFor="email">
            User Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            placeholder="Enter User email"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-white font-medium mb-2" htmlFor="email">
            User Role
          </label>
          <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white">
            {items.map((item) => (
              <option key={item.key} value={item.key}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-white font-medium mb-2" htmlFor="phone">
            User Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            placeholder="Enter User phone number"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 dark:text-white font-medium mb-2" htmlFor="address">
            User Address
          </label>
          <textarea
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            placeholder="Enter User address"
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

export default NewUserBox;
