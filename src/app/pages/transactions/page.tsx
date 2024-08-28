"use client";

import DefaultLayout from "@/components/Layouts/DefaultLaout";
import InvoiceBox from "@/components/InvoiceBox";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TransactionBox from "@/components/Transactions";
import Signin from "@/components/Auth/Signin";
import React, { useEffect, useState } from "react";

const ECommerce: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);;

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);   
    }
  }, []);

  return (
    <>
    <DefaultLayout>
    {token != null ? (<div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
            <div className="col-span-12 xl:col-span-12">
            <Breadcrumb pageName="Transactions" />
                {/* <TableOne /> */}
                <TransactionBox />
            </div>
        </div>) : <Signin />}

        
    </DefaultLayout> 
    </>
  );
};

export default ECommerce;
