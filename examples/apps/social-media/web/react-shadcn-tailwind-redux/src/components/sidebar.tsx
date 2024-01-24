import { Bookmark, Home, PlusCircle, Search, Users } from "lucide-react";
import { Button, buttonVariants } from "./ui/button";
import { Link, useLocation } from "react-router-dom";
import clsx from "clsx";

const menuItems = [
  {
    location: "/",
    title: "Home",
    Icon: Home,
  },
  {
    location: "/search",
    title: "Search",
    Icon: Search,
  },
  {
    location: "/create",
    title: "Create",
    Icon: PlusCircle,
  },
  {
    location: "/saved",
    title: "Saved",
    Icon: Bookmark,
  },
  {
    location: "/find-users",
    title: "users",
    Icon: Users,
  },
];

const Sidebar = () => {
  const { pathname } = useLocation();

  return (
    <div className="bg-card fixed bottom-0 p-5 w-full md:p-5   md:sticky  md:top-[70px] left-0 md:w-[150px] lg:w-[200px] md:min-h-[calc(100vh-70px)]">
      <div className="flex justify-around md:justify-start md:flex-col md:gap-5 md:mt-5 md:px-4 lg:px-5">
        {menuItems.map((option) => (
          <Link
            key={option.location}
            className={clsx(
              buttonVariants({
                variant: pathname === option.location ? "default" : "ghost",
                size: "menu",
              })
            )}
            to={option.location}
          >
            <option.Icon />
            <p className="hidden md:hidden lg:block">{option.title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
