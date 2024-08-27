'use client'
import ECommerce from "@/components/Dashboard/E-commerce";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import React, { useEffect, useState } from "react";
import Signin from "@/components/Auth/Signin";

export default function Home() {
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
        {token === null ? <ECommerce /> : <Signin />}
      </DefaultLayout>
    </>
  );
}
