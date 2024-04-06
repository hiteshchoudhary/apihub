import { Followerinterface } from "@/interfaces/profile";
import { Card } from "../ui/card";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Check, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { Skeleton } from "../ui/skeleton";

const FollowerFollowingCard = ({
  userDetails,
  type,
  followUnFollowHandler,
}: {
  userDetails: Followerinterface;
  type: "follower" | "following";
  followUnFollowHandler: (
    toBeFollowedUserId: string,
    action: "follow" | "unfollow",
    targetList: "user" | "follower" | "following"
  ) => void;
}) => {
  return (
    <Card className="w-full p-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Avatar className="md:w-20 md:h-20">
          <AvatarImage src={userDetails.avatar.url} />
        </Avatar>

        <div className="flex flex-col justify-start">
          <Link to={`/user/${userDetails.username}`}>
            {userDetails.profile.firstName} {userDetails.profile.lastName}
          </Link>
          <Link to={`/user/${userDetails.username}`}>
            {userDetails.username}
          </Link>
        </div>
      </div>

      {userDetails.isFollowing ? (
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2 text-sm" variant={"ghost"}>
              <Check className="w-5 h-5" /> Following
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>@{userDetails.username}</DialogTitle>
            </DialogHeader>

            <div>
              <p>
                Do you want to{" "}
                <span className="text-red-600">
                  unfollow @{userDetails.username}
                </span>
              </p>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button
                  onClick={(
                    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
                  ) => {
                    e.stopPropagation();
                    followUnFollowHandler(userDetails._id, "unfollow", type);
                  }}
                  variant={"destructive"}
                >
                  Unfollow
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : (
        <Button
          onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            e.stopPropagation();
            followUnFollowHandler(userDetails._id, "follow", type);
          }}
          className="text-sm gap-2"
        >
          <UserPlus className="w-5 h-5" /> Follow
        </Button>
      )}
    </Card>
  );
};

FollowerFollowingCard.Skeleton = () => {
  return (
    <Card className="w-full p-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 md:w-20 md:h-20 rounded-full" />

        <div className="flex flex-col gap-3 justify-start">
          <Skeleton className="h-5 w-32" />

          <Skeleton className="h-5 w-16" />
        </div>
      </div>
      <Skeleton className="w-28 h-10" />
    </Card>
  );
};

export { FollowerFollowingCard };
