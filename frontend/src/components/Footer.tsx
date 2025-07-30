import React from "react";

const Footer: React.FC = () => {
  return (
    <div className="bg-[#121212] text-white py-12 px-4">
      <div className="container mx-auto text-center">
        <h3 className="text-xl font-light">
          © {new Date().getFullYear()} All rights reserved.
        </h3>
      </div>
    </div>
  );
};

export default Footer;
