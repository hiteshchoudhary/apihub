import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";

interface UserContextType {
  user: {
    posts: string[];
    name: string;
    imageUrl: string;
  };
}

const UserPosts = () => {
  const [posts, setPosts] = useState<any[]>([]);
  // Access the context (user) here
  const { user } = useOutletContext<UserContextType>();

  useEffect(() => {
    setPosts(user.posts);
  }, [user]);

  if (!posts || posts.length === 0) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <p>No posts yet</p>
      </div>
    );
  }

  return (
    <ul className="grid-container-profile w-full h-full">
      {
        posts?.map((post) => (
          <li key={post.$id} className="relative w-full h-full">
            <Link to={`/post/${post.$id}`} className="grid-post_link_profile">
              <img
                src={post.imageUrl}
                alt={post.caption}
                className="object-cover w-full h-full"
              />
            </Link>
          </li>
        ))
      }
    </ul>
  );
};

export default UserPosts;
