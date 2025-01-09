// components/sections/services-section.tsx
"use client";

import Image from "next/image";

interface ServiceData {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  isActive: boolean;
}

interface WhySectionProps {
  services: ServiceData[];
  data: {
    mainTitle: string;
  }
}

const WhySection = ({ data , services  }: WhySectionProps) => {
  return (
    <section className="sectionWR sectionBGColor">
    {/* <!-- <img className="imageBG" src="images/BG1.svg" alt=""> --> */}
    <div className=" container relative">
      <div className="pt-10">
        <div className="ballsCT">
          <div className="ballsColor">
            <div className="ballC"></div>
            <div className="ballC"></div>
            <div className="ballC"></div>
          </div>
          <div>
            <span className="uppercase font-bold text-white">WHY REACHY?</span>
          </div>
        </div>

        <div className="textSOC mt-5 sm:mt-10 w-full">
          <h2 className="uppercase max-w-3xl mx-auto font-bold text-white text-center text-xl md:text-2xl lg:text-3xl">
            We build the bridge between
            your brand and customer
          </h2>

          <div className="cards mt-8 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="cardWR">
              <Image src="images/TEAM1.svg" alt=""/>
              <h4 className="text-2xl">Specialized Team</h4>
              <p className="text-base">Our team includes experts in all areas of digital marketing</p>
            </div>
            <div className="cardWR">
              <Image src="images/TEAM2.svg" alt=""/>
              <h4 className="text-2xl">Customized Solutions</h4>
              <p className="text-base">We design strategies to fit your unique needs</p>
            </div>
            <div className="cardWR">
              <Image src="images/TEAM3.svg" alt=""/>
              <h4 className="text-2xl">Tangible Results</h4>
              <p className="text-base">We focus on achieving your goals as efficiently as possible</p>
            </div>
            <div className="cardWR">
              <Image src="images/TEAM4.svg" alt=""/>
              <h4 className="text-2xl">Ongoing Support</h4>
              <p className="text-base">Provide continuing support to ensure success of your projects</p>
            </div>
          </div>


        </div>
      </div>
    </div>
    <Image className="arrowSC arrowSC3" src="images/arrow3.svg" alt="" />
  </section>
  );
};

export default WhySection;