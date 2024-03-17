import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import navigationMenuItems from "./menuItem";
import { NavigationMenuLink } from "@radix-ui/react-navigation-menu";
import { Link } from "react-router-dom";

export default function Header() {
  const { pathname } = window.location;
  return (
    <div className="flex justify-center w-full border-b-4 border-white">
      <div className="flex items-center justify-between w-full max-w-screen-lg p-4">
        <Link className="font-bold no-underline cursor-pointer" to="/">
          HTTP Status Insight
        </Link>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem className="space-x-4">
              {navigationMenuItems
                .filter((item) => !item.isDisabled)
                .map((item, index) => {
                  return (
                    <NavigationMenuLink
                      key={index}
                      href={item.path}
                      className={`text-white hover:text-blue-500 ${
                        pathname === item.path ? "text-blue-500" : ""
                      }`}
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
