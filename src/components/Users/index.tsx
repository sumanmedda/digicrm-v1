'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TiDeleteOutline } from "react-icons/ti";
import { FiCopy } from "react-icons/fi";

const initialUserData = [
  { UserId: "USR-001", name: "Ronak Sharma", email: "ronak.sharma@gmail.com", phone: "+91-7898778767", role: "Admin" },
  { UserId: "USR-002", name: "Sampad Medda", email: "medda.sampad@gmail.com", phone: "+91-7865674467", role: "User" },
  { UserId: "USR-003", name: "Nitin Vyas", email: "nitin.kumar.vyas@gmail.com", phone: "+91-9988764531", role: "Editor" },
  { UserId: "USR-004", name: "Dharmendra Solanki", email: "d.solanki@gmail.com", phone: "+91-9334675569", role: "Admin" },
  { UserId: "USR-005", name: "Sparsh Rayasan", email: "sparsh.rayasan111@gmail.com", phone: "+91-9873345769", role: "User" },
  { UserId: "USR-006", name: "Debasis De", email: "debasisde867@gmail.com", phone: "+91-96645678349", role: "Super Admin" },
  { UserId: "USR-007", name: "Raju Singh", email: "raju.singh55@gmail.com", phone: "+91-8135259871", role: "User" },
]

const UserBox = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [Users, setUsers] = useState(initialUserData);
  const itemsPerPage = 5;

  const handleDelete = (UserId: string) => {
    const updatedUsers = Users.filter(User => User.UserId !== UserId);
    setUsers(updatedUsers);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const filteredUsers = Users.filter((User) =>
    User.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    User.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    User.phone.includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleRowClick = (UserId: string) => {
    router.push(`/pages/users/${UserId}`);
  };

  return (
    <div className="rounded-[10px] bg-white px-4 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      
      {/* Add User Button */}
      <div className="mb-5.5">
        <button
          onClick={() => router.push("/pages/newuser")}
          className="px-4 py-2 border border-green-500 rounded-md bg-green-500 text-white hover:bg-green-600 w-full sm:w-auto"
        >
          Add User
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center mb-5.5">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 p-2 rounded-md w-full"
        />
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <div className="hidden sm:grid sm:grid-cols-5">
          <div className="px-2 pb-3.5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              User Name
            </h5>
          </div>
          <div className="px-2 pb-3.5 text-center">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Email
            </h5>
          </div>
          <div className="px-2 pb-3.5 text-center">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Phone
            </h5>
          </div>
          <div className="px-2 pb-3.5 text-center">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Role
            </h5>
          </div>
          <div className="px-2 pb-3.5 text-center">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Action
            </h5>
          </div>
        </div>

        {paginatedUsers.map((User) => (
          <div
            className="grid grid-cols-1 sm:grid-cols-5 sm:gap-0 gap-y-2 border-b border-stroke dark:border-dark-3 cursor-pointer sm:min-w-[500px] min-w-full"
            key={User.UserId}
            onClick={() => handleRowClick(User.UserId)}
          >
            <div className="flex items-center gap-3.5 px-2 py-4">
              <p className="font-medium text-dark dark:text-white sm:text-left text-center w-full sm:w-auto">
                {User.name}
              </p>
            </div>

            <div className="flex items-center justify-between px-2 py-4 sm:justify-center sm:col-span-1">
              <p className="font-medium text-dark dark:text-white text-center sm:text-left">
                {User.email}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy(User.email);
                }}
                className="ml-2 text-gray-500 hover:text-gray-700"
              >
                <FiCopy />
              </button>
            </div>

            <div className="flex items-center justify-between px-2 py-4 sm:justify-center sm:col-span-1">
              <p className="font-medium text-dark dark:text-white text-center sm:text-left">
                {User.phone}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy(User.phone);
                }}
                className="ml-2 text-gray-500 hover:text-gray-700"
              >
                <FiCopy />
              </button>
            </div>

            {/* Role column */}
            <div className="flex items-center justify-center px-2 py-4 sm:justify-center sm:col-span-1">
              <p className="font-medium text-dark dark:text-white text-center sm:text-left">
                {User.role}
              </p>
            </div>

            <div className="flex items-center justify-center px-2 py-4 sm:justify-center sm:col-span-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(User.UserId);
                }}
                className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 w-full sm:w-auto text-center"
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

export default UserBox;
