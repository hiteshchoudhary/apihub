import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import navigationMenuItems from "./menuItem";
import { NavigationMenuLink } from "@radix-ui/react-navigation-menu";
import { Link, useLocation } from "react-router";

export default function Header() {
  const { pathname } = useLocation();
  return (
    <header className="sticky top-4 z-50 flex justify-center w-full px-4 sm:px-6">
      <div className="flex items-center justify-between w-full max-w-screen-lg px-6 py-3 bg-neutral-900/80 backdrop-blur-xl backdrop-saturate-150 border border-white/15 rounded-full shadow-2xl shadow-black/50 transition-all duration-300">
        <Link
          className={`flex items-center gap-2 font-bold text-base sm:text-lg tracking-tight no-underline cursor-pointer transition-all duration-200 hover:opacity-90`}
          to="/"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
          <span
            className={
              pathname === "/"
                ? "bg-gradient-to-r from-blue-400 via-indigo-300 to-blue-500 bg-clip-text text-transparent font-extrabold"
                : "text-white hover:text-blue-400"
            }
          >
            HTTP Status Insight
          </span>
        </Link>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem className="flex items-center space-x-1 sm:space-x-2">
              {navigationMenuItems
                .filter((item) => !item.isDisabled)
                .map((item) => {
                  const activeLink = pathname === item.path;
                  return (
                    <NavigationMenuLink
                      key={item.path}
                      href={item.path}
                      className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                        activeLink
                          ? "bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-sm shadow-blue-500/10 font-semibold"
                          : "text-slate-300 hover:text-white hover:bg-white/10"
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
    </header>
  );
}
