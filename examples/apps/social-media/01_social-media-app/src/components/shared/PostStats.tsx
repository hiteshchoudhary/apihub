import { useDeleteSavePost, useGetCurrentUser, useLikePost, useSavePost } from "@/lib/react-query/queriesAndMutation";
import { checkIsLiked } from "@/lib/utils";
import { Models } from "appwrite";
import { useEffect, useState } from "react";
import Loader from "./Loader";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";



type PostStatsProps = {
   post?: Models.Document;
   userId: string;
}
const PostStats = ({ post, userId }: PostStatsProps) => {
   const likesList = post?.likes.map((user: Models.Document) => user.$id);
   const [likes, setLikes] = useState(likesList);
   const [isSaved, setIsSaved] = useState(false);
   const navigate = useNavigate();

   const { mutate: likePost, isPending: isLikeing } = useLikePost();
   const { mutate: savePost, isPending: isSavingPost } = useSavePost();
   const { mutate: deleetPost, isPending: isDeletingSavePost } = useDeleteSavePost();

   const { data: currentUser } = useGetCurrentUser();
   const savePostRecord = currentUser?.save.find((record: Models.Document) => record.post && record.post.$id === post?.$id);

   useEffect(() => {
      setIsSaved(!!savePostRecord); // here !! is used to convert the value to boolean
   }, [currentUser]);

   const handleLikePosts = (e: React.MouseEvent) => {
      e.stopPropagation();
      let newLikes = [...likes];
      const hasLiked = checkIsLiked(likes, userId);
      if (hasLiked) {
         newLikes = newLikes.filter((id) => id !== userId);
      } else {
         newLikes.push(userId);
      }

      setLikes(newLikes);
      if (post) {
         likePost({ postId: post.$id, likesArray: newLikes });
      }
   }
   const handleSavePosts = (e: React.MouseEvent) => {
      e.stopPropagation();

      if (savePostRecord) {
         setIsSaved(false);
         deleetPost(savePostRecord.$id);
      } else {
         if (post?.$id) {
            savePost({ postId: post.$id, userId });
            setIsSaved(true);
         }
      }
   }

   const shareablePostLink = () => {
      const baseUrl = 'https://kochugram.rajislab.com/post/';
      const postLink = `${baseUrl}${post?.$id}`;

      // Copy the link to the clipboard
      navigator.clipboard.writeText(postLink).then(() => {
         // Show success toast after successfully copying the link
         toast({ title: 'Link copied to clipboard' });
      }).catch(error => {
         // Handle any errors while copying
         console.error('Error copying link: ', error);
         toast({ title: 'somthing wrong' });
      });
   };


   return (
      <div className="flex flex-1 justify-between items-center h-fit">
         <div className="w-fit flex gap-5">
            <button className="flex flex-1 gap-2 items-center">
               {isLikeing ? <Loader /> :
                  <img
                     onClick={handleLikePosts}
                     src={checkIsLiked(likes, userId) ?
                        "/assets/icons/liked.svg" :
                        "/assets/icons/like.svg"
                     }
                     alt="like"
                  />
               }
               <p className="small-medium lg:base-medium">{likes.length}</p>
            </button>
            <button
               onClick={() => {
                  navigate(`/post/${post?.$id}`)
               }}
               className="flex flex-1 gap-2 items-center">
               <img
                  src="/assets/icons/comment.svg"
                  alt="comment-icon"
               />
               <p className="small-medium lg:base-medium">{post?.comments.length}</p>
            </button>
            <button onClick={shareablePostLink}>
               <img
                  src="/assets/icons/share.svg"
                  alt="share"
               />
            </button>
         </div>
         <button onClick={handleSavePosts}>
            {
               isDeletingSavePost || isSavingPost ? <Loader /> :
                  <img
                     src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
                  />
            }
         </button>
      </div>
   )
}

export default PostStats