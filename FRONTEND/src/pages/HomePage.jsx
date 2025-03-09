import React from 'react';
import HeroSection from '../components/HeroSection';
import FeatureShowcase from '../components/FeatureShowcase';
import Navbar from '../components/Navbar';


const HomePage = () => {
  return (
    <>
      <Navbar />
      <HeroSection />
      <FeatureShowcase />
    </>
  );
};

export default HomePage;  