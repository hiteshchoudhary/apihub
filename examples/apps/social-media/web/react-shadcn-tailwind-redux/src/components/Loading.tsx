import { Loader } from "lucide-react";

const Loading = () => {
  return (
    <div className="w-full flex gap-3 justify-center py-20">
      <p className="text-2xl">loading</p>
      <Loader className="animate-spin h-10 w-10" />
    </div>
  );
};

export default Loading;
