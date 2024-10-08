'use client';

import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import CustomAlert from '@/components/CustomAlert';

interface Customer {
  customerId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

// Initial customer data for demo purposes
const initialCustomerData: Customer[] = [
  {
    customerId: 'CSTR-001',
    name: 'Caparo',
    email: 'sales@caparo.com',
    phone: '+91-7764598367',
    address: 'A-7, Chopanki Industrial Area, Bhiwadi, Alwar-415514, Rajasthan, India',
  },
  {
    customerId: 'CSTR-002',
    name: 'LPS',
    email: 'lps.sales@lps.com',
    phone: '+91-9987364738',
    address: '456 Elm St, Rohtak',
  },
  // Add more customers as needed
];

const CustomerDetails = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [demoCustomer, setDemoCustomer] = useState({});
  const router = useRouter();
  const { customerId } = useParams();
  const [customer, setCustomer] = useState<Customer | undefined>(undefined);
  const [alertMessage, setAlertMessage] = useState<{ message?: string; type?: string }>({});

  const showAlert = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    setAlertMessage({ message, type });
    setTimeout(() => setAlertMessage({}), 3000); // Clear alert after 3 seconds
  };

  useEffect(() => {
    // Simulate fetching customer data based on ID
    const foundCustomer = initialCustomerData.find((c) => c.customerId === customerId);
    setCustomer(foundCustomer);
  }, [customerId]);

  if (!customer) {
    return <DefaultLayout><div><center>Loading...</center></div></DefaultLayout>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    const customerId = crypto.randomUUID()
    const newCustomerData = {customerId:customerId,"name":name, "email":email, "phone":phone, "address":address}
    setDemoCustomer(newCustomerData)
    localStorage.setItem('newCustomer',  JSON.stringify(newCustomerData))
    showAlert('Customer Created Successfully!', 'success');
    setTimeout(() => router.back(), 3000);
  };

  const handleBackClick = () => {
    router.back();
  };

  return (
    <DefaultLayout>
      <div className="p-4 md:p-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-4 px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          Back
        </button>

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
        <CustomAlert message={alertMessage.message || ''} type={alertMessage.type as any} />
      </div>
    );
      </div>
    </DefaultLayout>
  );
};

export default CustomerDetails;
