import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import navigationMenuItems from "./menuItem";
import { NavigationMenuLink } from "@radix-ui/react-navigation-menu";

export default function Header() {
  return (
    <div className="flex justify-center w-full border-b-4 border-white">
      <div className="flex items-center justify-between w-full max-w-screen-lg p-4">
        <a className="font-bold no-underline cursor-pointer">
          HTTP Status Insight
        </a>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem className="space-x-4">
              {navigationMenuItems.map((item, index) => {
                return (
                  <NavigationMenuLink
                    key={index}
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
