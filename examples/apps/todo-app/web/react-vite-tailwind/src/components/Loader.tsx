import { FaSpinner } from "react-icons/fa6";

const Loader = () => {
  return (
    <div className="w-full h-24 flex justify-center gap-3 items-center">
      <p>fetching todos</p>
      <FaSpinner className="animate-spin text-2xl" />
    </div>
  );
};

export default Loader;
