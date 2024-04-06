import { ReactNode } from "react";

const MainPageContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div className=" container overflow-y-auto flex justify-start md:absolute md:top-[70px] md:left-[150px] lg:left-[200px] max-h-[calc(100vh-70px)] md:max-w-[calc(100vw-150px)] lg:max-w-[calc(100vw-200px)] p-0 pt-3 md:p-3">
      <div className="self-start container max-lg:!p-1  lg:ml-0">
        {children}
      </div>
    </div>
  );
};

export default MainPageContainer;
