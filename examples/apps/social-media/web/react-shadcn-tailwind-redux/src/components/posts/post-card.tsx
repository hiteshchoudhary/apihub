import { PostsInterface } from "@/interfaces/posts";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import moment from "moment";
import { Button } from "../ui/button";
import { Bookmark, Heart, LucideIcon, MessageCircleMore } from "lucide-react";
import clsx from "clsx";
import { ImageCarousel } from "../image-carousel";
import { Skeleton } from "../ui/skeleton";

import { useNavigate } from "react-router-dom";

const PostCard = ({
  post,
  onLike,
}: {
  post: PostsInterface;
  onLike: (postId: string) => Promise<void>;
}) => {
  const navigate = useNavigate();

  const likePostHandler = () => {
    onLike(post._id);
  };

  const visitUserProfile = () => {
    navigate(`/user/${post.author.account.username}`);
  };

  const commentPostHandler = () => {
    console.log("comment");
  };

  const bookmarkPostHandler = () => {
    console.log("bookmark");
  };

  const footerOptions = [
    {
      icon: Heart,
      number: post.likes,
      isActive: post.isLiked,
      action: likePostHandler,
    },
    {
      icon: MessageCircleMore,
      number: post.comments,
      isActive: false,
      action: commentPostHandler,
    },
    {
      icon: Bookmark,
      number: null,
      isActive: post.isBookmarked,
      action: bookmarkPostHandler,
    },
  ];

  return (
    <Card>
      <CardHeader onClick={visitUserProfile} className="p-3 cursor-pointer ">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={post.author?.account.avatar.url} />
            <AvatarFallback>API</AvatarFallback>
          </Avatar>
          <p>{post.author?.account.username}</p>
          <p className="text-xs text-muted-foreground">
            {" "}
            {moment(post.updatedAt).add("TIME_ZONE", "hours").fromNow(true)} ago
          </p>
        </div>
      </CardHeader>
      <CardContent className="">
        <div>{post.content}</div>

        {post.images.length > 0 ? (
          <div className="flex justify-center mt-3">
            <ImageCarousel images={post.images} />
          </div>
        ) : null}
      </CardContent>
      <CardFooter className="flex justify-start gap-4">
        {footerOptions.map((option, i) => (
          <FooterButtons
            key={i}
            Icon={option.icon}
            isActive={option.isActive}
            number={option.number}
            action={option.action}
          />
        ))}
      </CardFooter>
    </Card>
  );
};

PostCard.Skeleton = () => {
  return (
    <>
      <Card>
        <CardHeader className="p-3 ">
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-full " />
            <Skeleton className="h-5 w-32" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2 pl-8">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-[60%]" />
            <Skeleton className="h-5 w-[70%]" />
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex gap-4 pl-10">
            <Skeleton className="w-5 h-5" />
            <Skeleton className="w-5 h-5" />
            <Skeleton className="w-5 h-5" />
          </div>
        </CardFooter>
      </Card>
    </>
  );
};

const FooterButtons = ({
  Icon,
  isActive,
  number,
  action,
}: {
  Icon: LucideIcon;
  isActive: boolean;
  number: number | null;
  action: () => void;
}) => {
  return (
    <div className="flex items-center">
      <Button onClick={action} variant={"icon"} size={"icon"}>
        <Icon
          className={clsx({
            "text-primary": isActive,
          })}
          fill={isActive ? "#7c3aed" : "transparent"}
        />
      </Button>
      {number && <span className="pl-1">{number}</span>}
    </div>
  );
};

export default PostCard;
