'use client';

import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import DefaultLayout from "@/components/Layouts/DefaultLaout";

interface User {
  UserId: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  address: string;
}

// Initial User data for demo purposes
const initialUserData: User[] = [
  {
    UserId: 'USR-001',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '123-456-7890',
    role: 'Admin',
    address: '123 Main St, Springfield',
  },
  {
    UserId: 'USR-002',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '987-654-3210',
    role: 'User',
    address: '456 Elm St, Metropolis',
  },
  // Add more Users as needed
];

const UserDetails = () => {
  const router = useRouter();
  const { UserId } = useParams();
  const [User, setUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    // Simulate fetching User data based on ID
    const foundUser = initialUserData.find((c) => c.UserId === UserId);
    setUser(foundUser);
  }, [UserId]);

  if (!User) {
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

        {/* User Details */}
        <div className="bg-white dark:bg-gray-dark rounded-lg shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold mb-4">User Details</h2>

          <p className="mb-2">
            <span className="font-semibold">User Name:</span> {User.name}
          </p>
          <p className="mb-2">
            <span className="font-semibold">Email:</span> {User.email}
          </p>
          <p className="mb-2">
            <span className="font-semibold">Phone:</span> {User.phone}
          </p>
          <p className="mb-2">
            <span className="font-semibold">Role:</span> {User.role}
          </p>
          <p className="mb-2">
            <span className="font-semibold">Address:</span> {User.address}
          </p>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default UserDetails;
