import { PostsInterface } from "@/interfaces/posts";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import moment from "moment";
import { Button } from "../ui/button";
import { Bookmark, Heart, MessageCircleMore } from "lucide-react";
import clsx from "clsx";
import { ImageCarousel } from "../image-carousel";
import { Skeleton } from "../ui/skeleton";

const PostCard = ({ post }: { post: PostsInterface }) => {
  return (
    <Card>
      <CardHeader className="p-3 ">
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
        <div className="flex items-center">
          <Button
            variant={"icon"}
            className={clsx(
              {
                "text-primary": post.isLiked,
              },
              ""
            )}
            size={"icon"}
          >
            <Heart />
          </Button>
          <span className="pl-1">{post.likes}</span>
        </div>
        <div className="flex items-center">
          <Button variant={"icon"} size={"icon"}>
            <MessageCircleMore />
          </Button>
          <span className="pl-1">{post.comments}</span>
        </div>
        <div className="flex items-center">
          <Button
            variant={"icon"}
            className={clsx(
              {
                "text-primary": post.isBookmarked,
              },
              ""
            )}
            size={"icon"}
          >
            <Bookmark />
          </Button>
        </div>
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

export default PostCard;
