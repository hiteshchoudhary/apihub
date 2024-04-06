import { Link, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { ThemeToggler } from "./theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import GoBack from "./GoBack";
import { Avatar, AvatarImage } from "./ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import clsx from "clsx";
import { LogOut, User } from "lucide-react";
import { requestHandler } from "@/utils";
import { logoutApi } from "@/api";
import { logout } from "@/redux/slices/authSlice";
import toast from "react-hot-toast";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const logoutHandler = async () => {
    await requestHandler(
      async () => await logoutApi(),
      null,
      (res) => {
        dispatch(logout());
        toast.success(res.message);
      },
      (error) => {
        toast.error(error);
      }
    );
  };

  return (
    <div className="sticky top-0 left-0 z-50 p-4 w-full bg-card flex items-center h-[70px] ">
      <div className="flex items-center w-full">
        <div className="flex items-center">
          <GoBack />
          <Button variant={"link"} onClick={() => navigate("/")}>
            <Logo size={80} />
          </Button>
        </div>

        <div className="ml-auto flex items-center justify-center gap-3">
          <ThemeToggler />

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage src={user?.avatar.url} />
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="bottom"
              className="mr-8 p-3 bg-background border-2 border-muted-foreground/20"
            >
              <DropdownMenuLabel className="text-xl font-normal">
                {user?.username}
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-muted-foreground/50" />
              <div className="space-y-4 mt-3">
                <DropdownMenuItem
                  className="hover:bg-zinc-800 cursor-pointer"
                  asChild
                >
                  <Link
                    to={`/user/${user?.username}`}
                    className={clsx(
                      "flex items-center p-3 font-normal gap-2 hover:!bg-zinc-700 "
                    )}
                  >
                    <User size={25} />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="hover:!bg-transparent hover:!text-red-500 hover:!ring-0 cursor-pointer"
                  asChild
                >
                  <Button
                    variant={"destructive"}
                    onClick={logoutHandler}
                    className={clsx(
                      "flex items-center gap-2 p-3 font-normal  "
                    )}
                  >
                    <LogOut />
                    Logout
                  </Button>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
