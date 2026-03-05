"use client";
import React from "react";
import HomePage from "../components/HomePage";
// import HowItWorksPage from "../components/HowItWorksPage";

const PackageVersionChecker = () => {
  return (
    <div className="min-h-screen flex flex-col bg-(--background) text-(--foreground) transition-colors duration-300">
      <HomePage />
      {/* <HowItWorksPage /> */}
    </div>
  );
};

export default PackageVersionChecker;
