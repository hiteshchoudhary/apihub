import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import navigationMenuItems from "./menuItem";
import { NavigationMenuLink } from "@radix-ui/react-navigation-menu";
import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const { pathname } = useLocation();
  return (
    <div className="fixed top-0 flex justify-center w-full border-b-4 border-white min-h-[56px] bg-[#333333]">
      <div className="flex items-center justify-between w-full max-w-screen-lg p-4">
        <Link
          className={`font-bold no-underline cursor-pointer 
          ${pathname === "/" ? "text-blue-500" : "text-white"}
          hover:text-blue-500
        `}
          to="/"
        >
          HTTP Status Insight
        </Link>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem className="space-x-4">
              {navigationMenuItems
                .filter((item) => !item.isDisabled)
                .map((item) => {
                  const activeLink = pathname === item.path;
                  if (activeLink) {
                    return (
                      <NavigationMenuLink
                        key={item.path}
                        href={item.path}
                        className="text-blue-500"
                      >
                        {item.title}
                      </NavigationMenuLink>
                    );
                  }
                  return (
                    <NavigationMenuLink
                      key={item.path}
                      href={item.path}
                      className={`text-white hover:text-blue-500`}
                    >
                      {item.title}
                    </NavigationMenuLink>
                  );
                })}
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
}
