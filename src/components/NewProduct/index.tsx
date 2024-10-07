'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import CustomAlert from "../CustomAlert";
import { randomUUID } from "crypto";


const NewProductBox = () => {
  const [chem, setChem] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [amount, setAmount] = useState("");
  const [hsnSacCode, setHsnSacCode] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [qty, setQty] = useState("");
  const [description, setDescription] = useState("");
  const [uploadImage, setUploadImage] = useState(false);
  const router = useRouter();
  const [alertMessage, setAlertMessage] = useState<{ message?: string; type?: string }>({});

  const showAlert = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    setAlertMessage({ message, type });
    setTimeout(() => setAlertMessage({}), 3000); // Clear alert after 3 seconds
  };



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({
      chem,
      hsnSacCode,
      image,
      amount,
      qty,
      expiryDate,
      description,
    });

    const productId = crypto.randomUUID()

    const newProduct = {
      productId,
      chem,
      hsnSacCode,
      amount,
      qty,
      expiryDate,
    };

    localStorage.setItem("newProduct", JSON.stringify(newProduct))
    showAlert('Product Added Successfully!', 'success');
    console.log(newProduct)
    setTimeout(() => router.push('/pages/products'), 2000);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
  };

  const handleBackClick = () => {
    router.back();
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-md shadow-md dark:bg-gray-dark">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Create New Product</h2>
        <button
          onClick={handleBackClick}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring focus:ring-gray-300"
        >
          Back
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-white font-medium mb-2" htmlFor="title">
            Product Name
          </label>
          <input
            type="text"
            id="chem"
            value={chem}
            onChange={(e) => setChem(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            placeholder="Enter product name"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-white font-medium mb-2" htmlFor="price">
            Product HSN/SAC Code
          </label>
          <input
            type="text"
            id="hsnSacCode"
            value={hsnSacCode}
            onChange={(e) => setHsnSacCode(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            placeholder="Enter product HSN/SAC Code"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-white font-medium mb-2" htmlFor="price">
            Product Price
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            placeholder="Enter product price"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-white font-medium mb-2" htmlFor="quantity">
            Product Quantity
          </label>
          <input
            type="number"
            id="qty"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            placeholder="Enter product quantity"
            required
          />
        </div>

        <div className="mb-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={uploadImage}
              onChange={() => setUploadImage(!uploadImage)}
              className="form-checkbox h-5 w-5 text-blue-600 rounded focus:outline-none focus:ring focus:ring-blue-300 shadow-md"
            />
            <span className="ml-2 text-gray-700 dark:text-white font-medium">Do you want to upload Product Image?</span>
          </label>
        </div>

        {uploadImage && (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-white font-medium mb-2" htmlFor="image">
                Product Image
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-md focus:outline-none focus:ring focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                required
              />
              {image && (
                <div className="mt-4 flex flex-col sm:flex-row items-center">
                  <Image
                    src={URL.createObjectURL(image)}
                    alt="Product Image Preview"
                    width={150}
                    height={150}
                    className="rounded-md mb-4 sm:mb-0 sm:mr-4"
                  />
                  <button
                    onClick={handleRemoveImage}
                    type="button"
                    className="px-4 py-2 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300"
                  >
                    Remove Image
                  </button>
                </div>
              )}
            </div>
            
          </>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-white font-medium mb-2" htmlFor="price">
            Product Expiry Date
          </label>
          <input
            type="date"
            id="expiryDate"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            placeholder="Enter product Expiry Date"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 dark:text-white font-medium mb-2" htmlFor="description">
            Product Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            placeholder="Enter product description"
            rows={5}
            required
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Submit
          </button>
        </div>
      </form>
      <CustomAlert message={alertMessage.message || ''} type={alertMessage.type as any} />
    </div>
  );
};

export default NewProductBox;
