import { ProfileInterface } from "@/interfaces/profile";
import { Button, buttonVariants } from "../ui/button";
import {
  Cake,
  Check,
  Edit,
  Edit2,
  Mail,
  MapPin,
  Phone,
  UserPlus,
} from "lucide-react";
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
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";

import { Link } from "react-router-dom";
import { ChangeEvent, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { updateAvatarApi, updateCoverImageApi } from "@/api";
import { requestHandler } from "@/utils";
import toast from "react-hot-toast";
import { FaSpinner } from "react-icons/fa";
import {
  updateCoverImageSlice,
  updateUserProfileAvatar,
} from "@/redux/slices/profileSlice";
import { updateUserAvatar } from "@/redux/slices/authSlice";

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
    action: "follow" | "unfollow",
    targetList: "user" | "follower" | "following"
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

  const { user } = useSelector((state: RootState) => state.auth);
  const isSelfProfile = username === user?.username;

  const [image, setImage] = useState<null | Blob>(null);
  const [previewImage, setPreviewImage] = useState<null | string>(null);
  const [imgType, setImgType] = useState<"coverImage" | "avatar" | null>(null);
  const [isImageUpdating, setIsImageUpdating] = useState(false);
  const dispatch = useDispatch();

  const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = () => {
      if (reader.result) {
        setPreviewImage(reader.result as string);
        setImage(file);
      }
    };
  };

  const updateImageHandler = async () => {
    const apiToCall =
      imgType === "coverImage" ? updateCoverImageApi : updateAvatarApi;

    const formData = new FormData();

    formData.append(imgType!, image!);

    await requestHandler(
      async () => await apiToCall(formData),
      setIsImageUpdating,
      (res) => {
        console.log(res.data);
        if (imgType === "coverImage") {
          dispatch(
            updateCoverImageSlice({
              updatedProfile: res.data,
            })
          );
        } else {
          dispatch(
            updateUserProfileAvatar({
              updatedUser: res.data,
            })
          );

          dispatch(
            updateUserAvatar({
              updatedUser: res.data,
            })
          );
        }

        toast.success(res.message);
        setPreviewImage(null);
        setImage(null);
        setImgType(null);
      },
      (error) => {
        toast.error(error);
      }
    );
  };

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
            <img
              src={coverImage.url}
              className="rounded-md w-full aspect-video"
            />

            {isSelfProfile ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Label
                  htmlFor="coverImage"
                  className="rounded-full hover:cursor-pointer p-3 bg-purple-700  h-fit"
                >
                  <Edit className="size-5 text-white" />
                </Label>
                <Input
                  id="coverImage"
                  name="coverImage"
                  className="hidden"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    setImgType("coverImage");
                    changeImageHandler(e);
                  }}
                />
              </div>
            ) : null}

            <div className="flex justify-between items-center absolute bottom-0 left-0 w-full p-3  sm:p-4  bg-background/70">
              <div className="flex gap-2 items-center">
                <div className="border-2 rounded-full relative">
                  <Avatar className=" w-14 h-14 sm:w-20 sm:h-20">
                    <AvatarImage src={avatar.url} />
                    <AvatarFallback>API</AvatarFallback>
                  </Avatar>

                  {isSelfProfile ? (
                    <span className="absolute bottom-0 right-0 bg-purple-600 flex items-center justify-center p-2  rounded-full">
                      <Label
                        htmlFor="profileImage"
                        className="hover:cursor-pointer"
                      >
                        <Edit2 className="size-4 text-white" />
                      </Label>
                      <Input
                        id="profileImage"
                        name="profileImage"
                        className="hidden"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          setImgType("avatar");
                          changeImageHandler(e);
                        }}
                      />
                    </span>
                  ) : null}
                </div>

                <div className="flex flex-col text-sm sm:text-base flex-wrap">
                  <p className="font-bold">
                    {firstName} {lastName}
                  </p>
                  <p>@{username}</p>
                </div>
              </div>

              <div className="flex  items-center gap-5">
                {isSelfProfile && (
                  <Link
                    to={"/profile/edit"}
                    className={clsx(
                      buttonVariants({
                        variant: "link",
                      }),
                      "flex gap-2 items-center"
                    )}
                  >
                    <Edit />
                    Edit
                  </Link>
                )}
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
                              followUnFollowHandler(_id, "unfollow", "user")
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
                    onClick={() => followUnFollowHandler(_id, "follow", "user")}
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

      {isSelfProfile && previewImage && (
        <div className="absolute p-3 inset-0 backdrop-blur-xl bg-background/80 z-50 max-h-[calc(100vh-70px)] flex flex-col items-center">
          <img
            src={previewImage}
            className="w-full rounded-md bg-background h-auto border-2 border-muted-foreground/30 aspect-video"
          />

          <div className="flex justify-start w-full gap-4 mt-8">
            <Button
              onClick={() => {
                setPreviewImage(null);
                setImage(null);
                setImgType(null);
              }}
              variant={"destructive"}
              disabled={isImageUpdating}
            >
              Cancel
            </Button>
            <Button disabled={isImageUpdating} onClick={updateImageHandler}>
              {isImageUpdating ? (
                <>
                  Updating <FaSpinner className="animate-spin" />
                </>
              ) : (
                "Update"
              )}
            </Button>
          </div>
        </div>
      )}
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
