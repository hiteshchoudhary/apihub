import React from "react";

const ModalContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="z-40 absolute top-0 left-0 w-[100%] h-[100%] flex justify-center items-center bg-black/50 backdrop-blur-md">
      {children}
    </div>
  );
};

export default ModalContainer;
