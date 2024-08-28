'use client'
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

// import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import AboutBoxes from "@/components/About";
import React, { useEffect, useState } from "react";
import Signin from "@/components/Auth/Signin";

// export const metadata: Metadata = {
//   title: "DIGICRM",
//   description: "About Digicrm",
// };

const About = () => {
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
        <Breadcrumb pageName="About" />

        <AboutBoxes />
      </div>): <Signin />}
    </DefaultLayout>
  );
};

export default About;
