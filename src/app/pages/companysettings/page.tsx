'use client'
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Signin from "@/components/Auth/Signin";
import React, { useEffect, useState } from "react";
import CompanySettingBoxes from "@/components/CompanySettingBox";

// export const metadata: Metadata = {
//   title: "Next.js Settings Page | NextAdmin - Next.js Dashboard c",
//   description: "This is Next.js Settings page for NextAdmin Dashboard Kit",
// };

const Settings = () => {
  const [token, setToken] = useState<string | null>(null);;

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);   
    }
  }, []);

  return (
    <DefaultLayout>
      {token != null ? (<div className="mx-auto w-full max-w-[1080px]">
        <Breadcrumb pageName="Settings" />

        <CompanySettingBoxes />
      </div>) : <Signin />}
      
    </DefaultLayout>
  );
};

export default Settings;
