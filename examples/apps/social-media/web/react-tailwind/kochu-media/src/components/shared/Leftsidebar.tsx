import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from "react";
import { Button } from "../ui/button"
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutation"
import { useUserContext } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { sidebarLinks } from '@/constants';
import { INavLink } from '@/types';
import Loader from './Loader';

const Leftsidebar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { mutate: signOut, isSuccess } = useSignOutAccount();
  const { user, isLoading } = useUserContext();
  useEffect(() => {
    if (isSuccess) {
      navigate('/sign-in');
      toast({ title: 'Logged out successfully' });
    }
  }, [isSuccess, navigate]);

  return (
    <nav className="leftsidebar">
      <div className="flex flex-col gap-11">
        <Link to="/" className="flex gap-3 items-center">
          <img
            src="/assets/images/logo.svg"
            alt="logo"
            width={170}
            height={36}
          />
        </Link>
        {
          isLoading ? (
            <Loader />
          ) : (
            <Link to={`/profile/${user.id}`} className="w-fit flex gap-5">
              <img
                src={user.imageUrl || '/assets/iamges/profile-placeholder.jpg'}
                alt="profile"
                className="h-12 w-12 rounded-full"
              />
              <div className="flex flex-col">
                <p className='body-bold'>
                  {user.name}
                </p>
                <p className='small-regular text-light-3'>
                  @{user.username}
                </p>
              </div>
            </Link>
          )
        }


        <ul className='flex flex-col gap-6'>
          {sidebarLinks.map((link: INavLink) => {
            const isActive = pathname === link.route;
            return (
              <li
                key={link.label}
                className={
                  `leftsidebar-link group ${isActive && 'bg-primary-500'
                  }`}
              >
                <NavLink
                  to={link.route}
                  className="flex gap-4 items-center p-4"
                >
                  <img
                    src={link.imgURL}
                    alt={link.label}
                    width={30}
                    height={30}
                    className={`group-hover:invert-white ${isActive ? 'invert-white' : ''}`}
                  />
                  {link.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>

      <Button
        variant={"ghost"}
        className="shad-button_ghost gap-2 flex items-center justify-start w-fit"
        onClick={() => signOut()}
      >
        <img
          src="/assets/icons/logout.svg"
          alt=""
          width={30}
          height={30}
        />
        <p className='small-medium lg:bade-medium'>
          Logout
        </p>
      </Button>
    </nav>
  )
}

export default Leftsidebar