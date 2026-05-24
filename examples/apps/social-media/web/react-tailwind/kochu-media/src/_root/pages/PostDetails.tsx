import BigLoader from "@/components/shared/BigLoader"
import PostComments from "@/components/shared/PostComments"
import PostStats from "@/components/shared/PostStats"
import { useUserContext } from "@/context/AuthContext"
import { toast } from "@/hooks/use-toast"
import { useDeletePost, useGetPostById } from "@/lib/react-query/queriesAndMutation"
import { formatDateMathYearDay } from "@/lib/utils"
import { Link, useNavigate, useParams } from "react-router-dom"

const PostDetails = () => {
   const navigate = useNavigate();
   // query params
   const { mutate: deletePost } = useDeletePost();

   const { id } = useParams()
   const { data: post, isPending } = useGetPostById(id || '')
   // useEffect(() => {
   //    console.log('post', post);
   // }, [post, navigate])

   const { user } = useUserContext()

   const handleDeletePost = () => {
      deletePost({ postId: post?.$id || '', imageId: post?.imageId || '' })
      navigate(-1);
      toast({ title: 'post deleted sucessfully' })
   }
   return (
      <div className="post_details-container">
         <div className="w-full h-fit flex gap-5">
            <button onClick={() => navigate(-1)}>
               <img
                  width={30}
                  src="/assets/icons/arrow.svg"
                  alt="back-btn"
               />
            </button>
            {
               isPending ? (null) : (
                  <h3 className="h3-bold md:h2-bold text-left w-full">Post</h3>
               )
            }
         </div>
         {
            isPending ? (<BigLoader />) : (
               <div className="w-full h-full flex flex-col lg:flex-row">
                  <div className="flex flex-col mt-5 h-fit w-full lg:w-1/2 items-center">
                     <div className="w-fit max-h-xl">
                        <img
                           src={post?.imageUrl}
                           className="post-card_details"
                           alt={post?.caption} />
                        <PostStats
                           post={post}
                           userId={user.id}
                        />
                     </div>
                     <div className="w-full h-full mt-5">
                        <div className="small-medium lg:base-medium py-2">
                           <p className="whitespace-pre-wrap text-light-2">
                              {parseCaption(post?.caption)}
                           </p>
                           <ul className="mt-1 flex gap-2 flex-wrap">
                              {post?.tags.map((tags: string) => (
                                 <li key={tags} className="text-light-3">
                                    #{tags}
                                 </li>
                              ))}
                           </ul>
                           <p className="mt-2">
                              {formatDateMathYearDay(post?.$createdAt || '')}
                           </p>
                        </div>
                        <div className="w-full h-fit flex mt-5 items-center lg:gap-10">
                           <div className="flex w-full gap-5 items-center">
                              <Link to={`/profile/${post?.creator.$id}`}>
                                 <p className="base-medium lg:body-bold text-light-1">{post?.creator.name}</p>
                                 <p className="subtle-semibold lg:small-ragular text-light-3">
                                    @{post?.creator.username}
                                 </p>
                              </Link>
                           </div>
                           <div className="flex gap-5">
                              <Link
                                 className={` right-5 ${user?.id !== post?.creator.$id && "hidden"}`}
                                 to={`/update-post/${post?.$id}`}
                              >
                                 <img
                                    src="/assets/icons/edit.svg"
                                    className="lg:w-10 lg:h-10"
                                    alt="edit" />
                              </Link>
                              <button
                                 className={` right-5 ${user?.id !== post?.creator.$id && "hidden"}`}
                                 onClick={handleDeletePost}
                              >
                                 <img
                                    src="/assets/icons/remove.svg"
                                    className="lg:w-10 lg:h-10"
                                    alt="remove" />
                              </button>
                           </div>
                        </div>
                     </div>
                  </div>
                  <PostComments
                     allComments={post?.comments}
                     postId={post?.$id}
                     userId={user?.id}
                  />
               </div>
            )
         }
      </div>
   )
}

export default PostDetails

// Independent function to parse caption and detect URLs
function parseCaption(caption: string): JSX.Element[] {
   const urlRegex = /(https?:\/\/[^\s]+)/g;

   const parts = caption.split(urlRegex);

   return parts.map((part, index) => {
      if (urlRegex.test(part)) {
         return (
            <a
               key={index}
               href={part}
               className="text-light-3 underline"
               target="_blank"
               rel="noopener noreferrer"
            >
               {part}
            </a>
         );
      }
      return <span key={index}>{part}</span>;
   });
}


