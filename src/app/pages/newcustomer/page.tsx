"use client";

import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Signin from "@/components/Auth/Signin";
import React, { useEffect, useState } from "react";
import NewCustomerBox from "@/components/NewCustomer";


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
            <Breadcrumb pageName="Add New Product" />
                {/* <TableOne /> */}
                <NewCustomerBox />
            </div>
        </div>) : <Signin />}

        
    </DefaultLayout> 
    </>
  );
};

export default ECommerce;
