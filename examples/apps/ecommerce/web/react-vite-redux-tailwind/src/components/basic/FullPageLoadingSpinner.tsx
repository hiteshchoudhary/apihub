import LoadingSpinner from "../icons/LoadingSpinner";
import { createPortal } from "react-dom";
import Text from "./Text";

interface FullPageLoadingSpinnerProps {
  message?: string;
}
const FullPageLoadingSpinner = (props: FullPageLoadingSpinnerProps) => {
  const { message = "" } = props;
  return (
    <>
      {createPortal(
        <div className="fixed top-0 w-screen h-screen flex justify-center items-center bg-black bg-opacity-50 z-20 flex-col">
          <LoadingSpinner className="w-20 h-20 fill-black text-gray-200" />
          {message && <Text className="mt-2 text-zinc-50 capitalize">{message}</Text>}
        </div>,
        document.getElementById("root") || document.body
      )}
    </>
  );
};

export default FullPageLoadingSpinner;
