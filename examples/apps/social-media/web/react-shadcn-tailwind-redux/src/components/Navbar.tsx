import { useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { ThemeToggler } from "./theme-toggle";
import { Button } from "./ui/button";
import GoBack from "./GoBack";

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <div className="sticky top-0 left-0 z-50 p-4 w-full bg-card flex items-center h-[70px] ">
      <div className="flex items-center w-full">
        <div className="flex items-center">
          <GoBack />
          <Button variant={"link"} onClick={() => navigate("/")}>
            <Logo size={80} />
          </Button>
        </div>

        <div className="ml-auto">
          <ThemeToggler />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
