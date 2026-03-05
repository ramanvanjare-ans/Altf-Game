"use client";

import React from "react";
import CouponHeader from "./(componnets)/CouponHeader";
import Hero from "./(componnets)/Hero";
import Categories from "./(componnets)/Categories";
import BestDeal from "./(componnets)/BestDeal";
import TrendingCategory from "./(componnets)/TrendingCategory";
import Online from "./(componnets)/Online";
import TrendingStore from "./(componnets)/TrendingStore";
import RecentAddStore from "./(componnets)/RecentAddStore";
import Blog from "./(componnets)/Blog";
import Feedback from "./(componnets)/Feedback";
import Brands from "./(componnets)/Brands";
import StatsSection from "./(componnets)/StatsSection";
import FAQ from "./(componnets)/FAQ";
import AboutSection from "./(componnets)/AboutSection";
import HeroSection from "./(componnets)/HeroSection";
import OutletDealsCard from "./(componnets)/OutletDealsCard";
import SubtractShape from "./(componnets)/autoDesign";




export default function DealsPage() {
 

  return (
    <div  >
          <CouponHeader/>
          <HeroSection/>
          <div className="md:mx-auto mx-4 max-w-7xl   " >
          <OutletDealsCard/>
          {/* <SubtractShape/>  */}
          <TrendingCategory/>
          <Online/>
          <TrendingStore/>
           <RecentAddStore/>
           <Blog/>
           <Feedback/>
           <Brands/>
           <StatsSection/>
           <FAQ/>
           <AboutSection/>
          </div>
          
           
          
    </div>
  );
}
