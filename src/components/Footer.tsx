import React from 'react';

const Footer = () => {
  return (
    <footer className="relative mt-auto overflow-hidden text-white" style={{ backgroundColor: '#003366' }}>
      {/* Top accent border */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-ps-secondary via-ps-accent to-ps-secondary" />
      
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-center items-center">
          <p className="text-sm text-white/80 text-center">
            © 2025 TÜV SÜD SOUTH ASIA PVT LTD. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;