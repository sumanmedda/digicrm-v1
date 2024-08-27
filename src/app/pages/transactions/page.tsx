"use client";
import React from "react";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import InvoiceBox from "@/components/InvoiceBox";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TransactionBox from "@/components/Transactions";

const ECommerce: React.FC = () => {
  return (
    <>
    <DefaultLayout>
        <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
            <div className="col-span-12 xl:col-span-12">
            <Breadcrumb pageName="Transactions" />
                {/* <TableOne /> */}
                <TransactionBox />
            </div>
        </div>
    </DefaultLayout> 
    </>
  );
};

export default ECommerce;
