'use client';

import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import DefaultLayout from "@/components/Layouts/DefaultLaout";

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
    name: 'John Doe',
    email: 'john@example.com',
    phone: '123-456-7890',
    address: '123 Main St, Springfield',
  },
  {
    customerId: 'CSTR-002',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '987-654-3210',
    address: '456 Elm St, Metropolis',
  },
  // Add more customers as needed
];

const CustomerDetails = () => {
  const router = useRouter();
  const { customerId } = useParams();
  const [customer, setCustomer] = useState<Customer | undefined>(undefined);

  useEffect(() => {
    // Simulate fetching customer data based on ID
    const foundCustomer = initialCustomerData.find((c) => c.customerId === customerId);
    setCustomer(foundCustomer);
  }, [customerId]);

  if (!customer) {
    return <DefaultLayout><div><center>Loading...</center></div></DefaultLayout>;
  }

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

        {/* Customer Details */}
        <div className="bg-white dark:bg-gray-dark rounded-lg shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold mb-4">Customer Details</h2>

          <p className="mb-2">
            <span className="font-semibold">Customer Name:</span> {customer.name}
          </p>
          <p className="mb-2">
            <span className="font-semibold">Email:</span> {customer.email}
          </p>
          <p className="mb-2">
            <span className="font-semibold">Phone:</span> {customer.phone}
          </p>
          <p className="mb-2">
            <span className="font-semibold">Address:</span> {customer.address}
          </p>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default CustomerDetails;
