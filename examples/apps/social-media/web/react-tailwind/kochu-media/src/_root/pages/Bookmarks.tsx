import BigLoader from "@/components/shared/BigLoader";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutation";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Bookmarks = () => {
  const { user, isLoading } = useUserContext();
  const navigate = useNavigate();
  const { mutate: signOut, isSuccess } = useSignOutAccount();

  useEffect(() => {
    if (isSuccess) {
      navigate('/sign-in');
      toast({ title: 'Logged out successfully' });
    }
  }, [isSuccess, navigate]);

  return (
    <div className="w-full h-full p-4 md:hidden">
      <div className="max-w-5xl flex-start gap-3 justify-start w-full">
        <button onClick={() => navigate(-1)}>
          <img width={30} src="/assets/icons/arrow.svg" alt="back-btn" />
        </button>
        {isLoading ? (null) : (
          <p className="body-medium  text-left w-full">
            {user?.name}
          </p>
        )
        }
      </div>
      {
        isLoading ? (<BigLoader />) : (
          <ul className="space-y-6 mt-5">
            {/* User Profile Section */}
            <li className="flex w-full items-center bg-dark-2 p-4 rounded-lg shadow-md hover:bg-dark-3 transition-colors">
              <Link to={`/profile/${user.id}`} className="flex items-center gap-4 w-full">
                <img
                  src={user.imageUrl}
                  alt={`${user.name}'s profile picture`}
                  className="object-cover w-12 h-12 rounded-full border-2 border-light-1"
                />
                <h1 className="text-lg font-medium text-light-1">{user.name}</h1>
              </Link>
            </li>

            {/* Logout Button */}
            <li>
              <Button
                onClick={() => signOut()}
                className="flex gap-3 w-full h-fit items-center justify-start p-4 bg-dark-2 rounded-lg shadow-md hover:bg-dark-3 transition-colors">
                <img
                  width={24}
                  src="/assets/icons/logout.svg"
                  alt="Logout icon"
                  className="inline-block"
                />
                <p className="text-xl font-bold text-light-1">Logout</p>
              </Button>
            </li>
          </ul>
        )
      }
    </div>
  );
};

export default Bookmarks;
