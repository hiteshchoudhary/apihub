// import { useUserContext } from "@/context/AuthContext";
import { Models } from "appwrite"
import { Link } from "react-router-dom";

type postListProps = {
   posts: Models.Document[];
   showUser?: boolean;
   showStats?: boolean;
}

const GridPostList = ({ posts, showUser = true }: postListProps) => {
   // const { user } = useUserContext();

   return (
      <ul className="grid-container w-full h-full">
         {
            posts?.map((post) => (
               <li key={post.$id} className="relative w-full h-full">
                  <Link to={`/post/${post.$id}`} className="grid-post_link">
                     <img
                        src={post.imageUrl}
                        alt={post.caption}
                        className="object-cover w-full h-full"
                     />
                  </Link>
                  <div className="grid-post_user">
                     {
                        showUser && (
                           <div className="flex items-center justify-start gap-3">
                              {post.creator && (
                                 <>
                                    <img
                                       className="h-8 w-8 rounded-full"
                                       src={post.creator.imageUrl}
                                       alt={post.creator.name} />
                                    <p className="line-clamp-1">
                                       {post.creator.name}
                                    </p>
                                 </>
                              )}
                           </div>
                        )
                     }
                  </div>
               </li>
            ))
         }
      </ul>
   )
}


export default GridPostList