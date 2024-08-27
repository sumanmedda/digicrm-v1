import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import AboutBoxes from "@/components/About";

export const metadata: Metadata = {
  title: "DIGICRM",
  description: "About Digicrm",
};

const About = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto w-full max-w-[1080px]">
        <Breadcrumb pageName="About" />

        <AboutBoxes />
      </div>
    </DefaultLayout>
  );
};

export default About;
