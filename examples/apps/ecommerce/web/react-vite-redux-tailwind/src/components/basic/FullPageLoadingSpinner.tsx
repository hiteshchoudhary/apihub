import LoadingSpinner from "../icons/LoadingSpinner";
import { createPortal } from "react-dom";

const FullPageLoadingSpinner = () => {
  return (
    <>
      {createPortal(
        <div className="fixed top-0 w-screen h-screen flex justify-center items-center bg-black bg-opacity-50 z-20">
          <LoadingSpinner className="w-20 h-20 fill-black text-gray-200" />
        </div>,
        document.getElementById('root') || document.body
      )}
    </>
  );
};

export default FullPageLoadingSpinner;
