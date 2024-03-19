import { Followerinterface } from "@/interfaces/profile";
import { Card, CardContent } from "../ui/card";
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

const FollowerFollowingCard = ({
  userDetails,
}: {
  userDetails: Followerinterface;
}) => {
  return (
    <Card className="w-full p-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Avatar className="md:w-20 md:h-20">
          <AvatarImage src={userDetails.avatar.url} />
        </Avatar>

        <div className="flex flex-col justify-start">
          <p>
            {userDetails.profile.firstName} {userDetails.profile.lastName}
          </p>
          <p>{userDetails.username}</p>
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
                  onClick={() => {}}
                  // followUnFollowHandler(_id, "unfollow")

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
          // onClick={() => followUnFollowHandler(_id, "follow")}
          className="text-sm gap-2"
        >
          <UserPlus className="w-5 h-5" /> Follow
        </Button>
      )}
    </Card>
  );
};

export default FollowerFollowingCard;
