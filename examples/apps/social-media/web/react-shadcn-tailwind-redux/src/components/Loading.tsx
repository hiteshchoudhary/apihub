import { Loader } from "lucide-react";

const Loading = () => {
  return (
    <div className="w-full flex justify-center">
      <Loader className="animate-spin h-6 w-6" />
    </div>
  );
};

export default Loading;
