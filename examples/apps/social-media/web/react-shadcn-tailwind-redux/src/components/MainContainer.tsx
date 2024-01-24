import { ReactNode } from "react";

const MainContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="overflow-y-auto md:absolute md:top-[70px] md:left-[150px] lg:left-[200px] max-h-[calc(100vh-70px)]">
      {children}
    </div>
  );
};

export default MainContainer;
