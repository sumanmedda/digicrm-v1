"use client";

import React, { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
const ChartTwo = dynamic(() => import('../Charts/ChartTwo'), { ssr: false });
import TableOne from "../Tables/TableOne";
import DataStatsOne from "@/components/DataStats/DataStatsOne";
import ChartOne from "@/components/Charts/ChartOne";
import Signin from "@/components/Auth/Signin";

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
        {token != null ? (
          <>
            <DataStatsOne />

<div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
  <ChartOne />
  <ChartTwo />
  {/* <ChartThree /> */}
  {/* <MapOne /> */}
  <div className="col-span-12 xl:col-span-12">
    <TableOne />
  </div>
  {/* <ChatCard /> */}
</div>
          </>
        ) : <Signin />}
    
      
    </>
  );
};

export default ECommerce;
