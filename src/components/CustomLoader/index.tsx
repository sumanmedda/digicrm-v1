'use client';
import { useState, useEffect } from 'react';

const CustomLoader = () => {
  const [isTextVisible, setIsTextVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTextVisible((prev) => !prev);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center">
      <div
        className={`transition-opacity duration-500 ${
          isTextVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <p className="text-center text-lg font-semibold text-white-700 dark:text-gray-300">
          Loading...
        </p>
      </div>

      <div
        className={`transition-opacity duration-500 absolute ${
          !isTextVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="loader w-8 h-8 border-t-4 border-white rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default CustomLoader;
