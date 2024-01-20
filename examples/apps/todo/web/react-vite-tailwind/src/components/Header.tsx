import { FaCirclePlus } from "react-icons/fa6";
import Button from "./Button";

const Header = ({ openTodoModal }: { openTodoModal: () => void }) => {
  return (
    <div className="sticky top-0 z-10 mx-auto flex w-full max-w-full items-center justify-between border-b-[1px] border-b-slate-300 bg-black/75 backdrop-blur-sm p-4 text-white lg:px-10">
      <h1 className="text-xl font-extrabold md:text-3xl">All todos</h1>
      <Button onClick={openTodoModal} className="border-[1px] border-white">
        <FaCirclePlus />
        Create new
      </Button>
    </div>
  );
};

export default Header;
