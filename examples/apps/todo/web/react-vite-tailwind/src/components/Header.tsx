import { useState } from "react";
import { FaCirclePlus, FaBars, FaXmark } from "react-icons/fa6";
import Button from "./Button";

interface HeaderProps {
  openTodoModal: () => void;
}

const Header: React.FC<HeaderProps> = ({ openTodoModal }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-300 bg-gradient-to-r from-black via-gray-900 to-black p-4 text-white backdrop-blur-sm shadow-md transition-all duration-300 ease-in-out">
      <div className="mx-auto flex max-w-screen-xl items-center justify-between">
        <h1 className="text-2xl font-extrabold md:text-3xl">📋 All Todos</h1>

        {/* Desktop Button */}
        <div className="hidden md:block">
          <Button
            onClick={openTodoModal}
            className="border border-white hover:bg-white hover:text-black transition-all duration-300"
          >
            <FaCirclePlus className="mr-2" />
            Create New
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="focus:outline-none text-2xl"
            aria-label="Toggle menu"
          >
            {menuOpen ? <FaXmark /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="mt-4 md:hidden animate-slideDown">
          <Button
            onClick={() => {
              openTodoModal();
              setMenuOpen(false);
            }}
            className="w-full border border-white py-3 text-center text-lg hover:bg-white hover:text-black transition-all duration-300"
          >
            <FaCirclePlus className="mr-2" />
            Create New
          </Button>
        </div>
      )}
    </header>
  );
};

export default Header;

