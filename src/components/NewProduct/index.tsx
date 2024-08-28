'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const NewProductBox = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({
      title,
      image,
      price,
      description,
    });
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
            Product Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            placeholder="Enter product title"
            required
          />
        </div>

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

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-white font-medium mb-2" htmlFor="price">
            Product Price
          </label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            placeholder="Enter product price"
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
            className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewProductBox;
