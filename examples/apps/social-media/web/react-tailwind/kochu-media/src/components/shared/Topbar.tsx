import { Link, NavLink, useLocation } from "react-router-dom";
import { INavLink } from "@/types";
import { getBookmarksLinks } from "@/constants";
import { useUserContext } from "@/context/AuthContext";

const Topbar = () => {
   const { user, isLoading } = useUserContext();  // Fetch user from context
   const { pathname } = useLocation();

   const BookmarksLinks = getBookmarksLinks(user);

   return (
      <>
         <div className="topbar flex">
            <div className="flex-between pt-3 px-5">
               <Link to="/" className="flex items-center">
                  <img
                     src="/assets/images/logo.svg"
                     alt="logo"
                     width={120}
                     height={315}
                  />
               </Link>
               <Link to={"/bookmarks"} className="flex-center">
                  <img
                     width={30}
                     height={30}
                     src="/assets/icons/menu.svg"
                     alt="hamburgur"
                  />
               </Link>
            </div>
            <div className="flex justify-between w-full bottom-0 pb-2 px-2">
               {BookmarksLinks.map((link: INavLink) => {
                  const isActive = isLoading || pathname === link.route;
                  return (
                     <NavLink
                        key={link.route}
                        to={isLoading ? "#" : link.route}  // Disable link navigation when loading
                        className={
                           `${isActive ? 'rounded-[10px] invert-white' : ''} flex-center flex-col gap-1 p-2 transition-all duration-200`
                        }
                        style={{
                           pointerEvents: isLoading ? "none" : "auto",  // Disable clicking when loading
                           opacity: isLoading ? 0.6 : 1,  // Optionally dim the links when loading
                        }}
                     >
                        <img
                           src={link.imgURL}
                           alt={link.label}
                           width={22}
                           height={22}
                           className={`group-hover:invert-white ${isActive ? 'invert-white' : ''}`}
                        />
                     </NavLink>
                  );
               })}
            </div>
         </div>
      </>
   );
};

export default Topbar;
