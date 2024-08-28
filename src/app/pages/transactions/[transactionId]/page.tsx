'use client';

import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import DefaultLayout from "@/components/Layouts/DefaultLaout";

interface Transaction {
  transactionId: string;
  customer: string;
  amount: string;
  billingDate: string;
  settlementDate: string;
  type: string;
  invoices?: string[];
  products: { id: string; name: string; price: string }[];
}

// Dummy product data
const productData = [
  { id: 'P001', name: 'Product 1', price: '100' },
  { id: 'P002', name: 'Product 2', price: '150' },
  { id: 'P003', name: 'Product 3', price: '200' },
];

// Initial transaction data for demo purposes
const initialTransactionData: Transaction[] = [
  {
    transactionId: 'TXN-001',
    customer: 'John Doe',
    amount: '1,250',
    billingDate: '2024-09-01',
    settlementDate: '2024-09-10',
    type: 'Credit',
    invoices: ['INV-001', 'INV-002'],
    products: productData,
  },
  {
    transactionId: 'TXN-002',
    customer: 'Jane Smith',
    amount: '2,450',
    billingDate: '2024-09-02',
    settlementDate: '2024-09-12',
    type: 'Debit',
    products: productData,
  },
  // Add more transactions as needed
];

const TransactionDetails = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { transactionId } = useParams();
//   const transactionId = searchParams.get('transactionId'); 
//   const transactionId = 'TXN-002'; 
  const [transaction, setTransaction] = useState<Transaction | undefined>(undefined);

  console.log('transactionId', transactionId)
  useEffect(() => {
    // Simulate fetching transaction data based on ID
    const foundTransaction = initialTransactionData.find((t) => t.transactionId === transactionId);
    setTransaction(foundTransaction);
  }, [transactionId]);

  if (!transaction) {
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

      {/* Transaction Details */}
      <div className="bg-white dark:bg-gray-dark rounded-lg shadow-lg p-6 md:p-8">
        <h2 className="text-2xl font-bold mb-4">Transaction Details</h2>

        <p className="mb-2">
          <span className="font-semibold">Transaction ID:</span> {transaction.transactionId}
        </p>

        {/* If type is Credit, show more details */}
        {transaction.type === 'Credit' && (
          <>
            {transaction.invoices && transaction.invoices.length > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold">Invoices:</h3>
                <ul className="list-disc ml-6">
                  {transaction.invoices.map((invoice, index) => (
                    <li key={index}>{invoice}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mb-4">
              <h3 className="text-lg font-semibold">Customer Details:</h3>
              <p>{transaction.customer}</p>
            </div>
          </>
        )}

        {/* Product List */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Product List:</h3>
          <ul className="list-disc ml-6">
            {transaction.products.map((product) => (
              <li key={product.id}>
                {product.name} - ${product.price}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
    </DefaultLayout>
  );
};

export default TransactionDetails;
