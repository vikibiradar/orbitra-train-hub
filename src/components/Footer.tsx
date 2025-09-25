import React from 'react';

const Footer = () => {
  return (
    <footer className="relative mt-auto overflow-hidden bg-gradient-header text-white">
      {/* Top accent border */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-border" />
      
      {/* Shimmer animation overlay */}
      <div className="absolute top-0 left-0 right-0 bottom-0 opacity-50">
        <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-tuv-accent-cyan/10 to-transparent animate-pulse" style={{
          animation: 'shimmer 3s infinite'
        }} />
      </div>
      
      {/* Main footer content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-center items-center">
          <p className="text-sm text-white/80 text-center font-medium">
            © 2025 TÜV SÜD SOUTH ASIA PVT LTD. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;