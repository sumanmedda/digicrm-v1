'use client'
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import UserBox from "@/components/Users";
import React, { useEffect, useState } from "react";
import Signin from "@/components/Auth/Signin";

// export const metadata: Metadata = {
//   title: "Next.js Settings Page | NextAdmin - Next.js Dashboard c",
//   description: "This is Next.js Settings page for NextAdmin Dashboard Kit",
// };

const User = () => {
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
        <Breadcrumb pageName="Users" />

        <UserBox />
      </div>) : <Signin />}

      
    </DefaultLayout>
  );
};

export default User;
