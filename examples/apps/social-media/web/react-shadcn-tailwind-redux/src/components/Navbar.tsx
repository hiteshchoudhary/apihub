import Logo from "./Logo";
import { ThemeToggler } from "./theme-toggle";

const Navbar = () => {
  return (
    <div className="sticky top-0 left-0 z-50 p-4 w-full bg-card flex items-center h-[80px]">
      <Logo size={100} />

      <div className="ml-auto">
        <ThemeToggler />
      </div>
    </div>
  );
};

export default Navbar;
