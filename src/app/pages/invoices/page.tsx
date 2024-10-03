'use client'
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import SettingBoxes from "@/components/SettingBoxes";
import InvoiceBox from "@/components/InvoiceBox";
import Signin from "@/components/Auth/Signin";
import React, { useEffect, useState } from "react";

// export const metadata: Metadata = {
//   title: "Next.js Settings Page | NextAdmin - Next.js Dashboard c",
//   description: "This is Next.js Settings page for NextAdmin Dashboard Kit",
// };

const Invoices = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);   
    }
  }, []);

  return (
    <DefaultLayout>
        {token != null ? (<div className="mx-auto w-full max-w-[1080px]">
        <Breadcrumb pageName="Invoices" />

        <InvoiceBox />
      </div>) : <Signin />}
      
      
    </DefaultLayout>
  );
};

export default Invoices;
