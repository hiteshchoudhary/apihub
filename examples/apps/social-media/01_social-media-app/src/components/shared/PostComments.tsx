import React, { useEffect, useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useUserContext } from '@/context/AuthContext';
import { Link } from 'react-router-dom';
import Loader from './Loader';
import { usePostComment } from '@/lib/react-query/queriesAndMutation';
import { formatDate } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface PostCommentsProps {
   allComments: any;
   userId: any;
   postId: any;
}

const PostComments: React.FC<PostCommentsProps> = ({ allComments, userId, postId }) => {
   const { user, isLoading } = useUserContext();
   const [comments, setComments] = useState<string>('');
   const [commentList, setCommentList] = useState<any>();
   // query
   const { mutateAsync: createComment, isPending: creatingNewComment } = usePostComment();

   useEffect(() => {
      // console.log('all comments', allComments);
      if (allComments) {
         setCommentList(allComments);
      }
   }, [allComments]);

   const handleCommentSubmit = async () => {
      if (!comments) {
         toast({ title: "Where Is your comment ?" });
         return;
      }

      try {
         const newComment = await createComment({
            postId: postId,
            userId: userId,
            comment: comments
         });

         if (newComment) {
            // Add the newly created comment to the comment list
            setCommentList((prevComments: any) => [
               ...prevComments,
               newComment,
            ]);
            setComments(''); // Clear the comment input
         } else {
            toast({ title: "Try again, server issue" });
         }
      } catch (error) {
         toast({ title: "Error posting comment, please try again." });
      }
   };

   return (
      <>
         <div className="lg:w-1/2 h-fit flex my-5 w-full justify-center flex-col">
            <div className='w-full h-full flex flex-1 py-5 px-2 border-b border-border-1'>
               <Link to={`/profile/${user.id}`} className="flex-center">
                  <img
                     src={user.imageUrl || '/assets/images/profile-placeholder.jpg'}
                     alt="profile"
                     className="rounded-full w-10"
                  />
               </Link>
               <Input
                  type="text"
                  placeholder="Post Your Comment"
                  className="drop-comment"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  disabled={creatingNewComment || isLoading}
               />
               {
                  creatingNewComment ? (<Loader />) : (
                     <Button
                        type="submit"
                        className="btn-primary border border-rose-50 rounded-full md:hover:bg-slate-600"
                        onClick={handleCommentSubmit}
                        disabled={creatingNewComment || isLoading}
                     >
                        Post
                     </Button>
                  )
               }
            </div>
            <div className='w-full h-full flex flex-col'>
               <p className='py-2'>
                  Top comments
               </p>
               <div className='w-full flex flex-col gap-6 py-6'>
                  {
                     commentList?.slice().reverse().map((comment: any) => (
                        <div className='flex flex-1 gap-4 border-b border-border-1 pb-4' key={comment?.id}>
                           <div className="flex items-center justify-center">
                              <img
                                 width={40}
                                 height={40}
                                 src={comment?.commentater.imageUrl || 'assets/images/profile-placeholder.jpg'}
                                 className="rounded-full object-cover"
                                 alt={comment.commentater.name}
                                 style={{ aspectRatio: '1/1' }}
                              />
                           </div>
                           <div className='flex flex-col'>
                              <div className='flex items-center gap-2'>
                                 <h3 className='text-sm font-semibold'>
                                    {comment.commentater.username}
                                 </h3>
                                 <p className='text-xs text-light-3'>
                                    {formatDate(comment?.$createdAt)}
                                 </p>
                              </div>
                              <p className='text-sm mt-2'>
                                 {comment.comment}
                              </p>
                           </div>
                        </div>
                     ))
                  }
               </div>
            </div>
         </div>
      </>
   );
}

export default PostComments;
