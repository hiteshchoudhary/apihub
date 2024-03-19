import { ProfileInterface } from "@/interfaces/profile";
import { Button } from "../ui/button";
import { Cake, Check, Mail, MapPin, Phone, UserPlus } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import moment from "moment";
import { Skeleton } from "../ui/skeleton";
import clsx from "clsx";

const ProfileCard = ({
  profile,
  totalPosts,
  followUnFollowHandler,
  changeCurrentTab,
  currentTab,
}: {
  profile: ProfileInterface;
  totalPosts: number;
  followUnFollowHandler: (
    toBeFollowedUserId: string,
    action: "follow" | "unfollow"
  ) => void;
  changeCurrentTab: (tab: string) => void;
  currentTab: string;
}) => {
  const {
    account: { _id, username, email, avatar },
    dob,
    location,
    followersCount,
    followingCount,
    firstName,
    lastName,
    bio,
    coverImage,
    isFollowing,
    phoneNumber,
  } = profile;

  const footertabs = [
    {
      title: "Posts",
      number: totalPosts,
      action: function () {
        changeCurrentTab(this.title);
      },
    },
    {
      title: "Followers",
      number: followersCount,
      action: function () {
        changeCurrentTab(this.title);
      },
    },
    {
      title: "Following",
      number: followingCount,
      action: function () {
        changeCurrentTab(this.title);
      },
    },
  ];

  return (
    <>
      <Card className="w-full p-0 mb-2">
        <CardContent className=" p-1 sm:p-2">
          <div className="aspect-video relative">
            <img src={coverImage.url} className="rounded-md w-full" />

            <div className="flex justify-between items-center absolute bottom-0 left-0 w-full p-3  sm:p-4  bg-background/70">
              <div className="flex gap-2 items-center">
                <Avatar className=" w-14 h-14 sm:w-20 sm:h-20">
                  <AvatarImage src={avatar.url} />
                  <AvatarFallback>API</AvatarFallback>
                </Avatar>

                <div className="flex flex-col text-sm sm:text-base flex-wrap">
                  <p className="font-bold">
                    {firstName} {lastName}
                  </p>
                  <p>@{username}</p>
                </div>
              </div>

              <div>
                {isFollowing ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="gap-2 text-sm" variant={"ghost"}>
                        <Check className="w-5 h-5" /> Following
                      </Button>
                    </DialogTrigger>

                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>@{username}</DialogTitle>
                      </DialogHeader>

                      <div>
                        <p>
                          Do you want to{" "}
                          <span className="text-red-600">
                            unfollow @{username}
                          </span>
                        </p>
                      </div>

                      <DialogFooter>
                        <DialogClose asChild>
                          <Button
                            onClick={() =>
                              followUnFollowHandler(_id, "unfollow")
                            }
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
                    onClick={() => followUnFollowHandler(_id, "follow")}
                    className="text-sm gap-2"
                  >
                    <UserPlus className="w-5 h-5" /> Follow
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="flex mt-2 flex-col p-2 gap-2">
            {bio && <p>{bio}</p>}
            {dob && (
              <p className="flex items-center gap-2">
                <Cake className="w-5 h-5" /> {moment(dob).format("DD/MM")}
              </p>
            )}
            {location && (
              <p className="flex items-center gap-2">
                {" "}
                <MapPin className="w-5 h-5" /> {location}
              </p>
            )}
            <a
              href={`mailto:${email}`}
              className="flex text-blue-700 items-center gap-2"
            >
              <Mail className="w-5 h-5" /> {email}
            </a>
            {phoneNumber && (
              <a
                href={`tel:${phoneNumber}`}
                className="flex text-blue-700 items-center gap-2"
              >
                <Phone className="w-5 h-5" /> {phoneNumber}
              </a>
            )}
          </div>

          <div className="py-4 w-full flex justify-around items-center border-t-2 mt-2">
            {footertabs.map((tab) => (
              <div
                onClick={() => tab.action()}
                key={tab.title}
                className={clsx(
                  "cursor-pointer relative font-bold flex flex-col items-center after:w-0 after:border-0 after:absolute  after:transition-all after:-top-1 after:border-t-2 after:border-primary",
                  {
                    "after:w-full ": currentTab === tab.title,
                  }
                )}
              >
                <p className="">{tab.title}</p>
                <p>{tab.number || 0}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

ProfileCard.Skeleton = () => {
  return (
    <>
      <Card className="p-0 w-full">
        <CardContent className="p-1 sm:p-2">
          <div className=" aspect-video relative">
            <Skeleton className="w-full h-full" />
            <div className="flex justify-between items-center absolute bottom-0 left-0 w-full p-3  sm:p-4  bg-card">
              <div className="flex gap-2 items-center">
                <Skeleton className="w-14 h-14 sm:w-20 sm:h-20 rounded-full" />

                <div className="flex flex-col  gap-2 ">
                  <Skeleton className=" w-28 sm:w-32 h-5" />
                  <Skeleton className=" w-16 sm:w-24 h-5" />
                </div>
              </div>

              <Skeleton className="w-[25%] h-10" />
            </div>
          </div>

          <div className="flex mt-2 flex-col p-2 gap-2">
            <Skeleton className="w-[60%] h-5" />
            <Skeleton className="w-[60%] h-5" />
            <Skeleton className="w-[60%] h-5" />
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default ProfileCard;
