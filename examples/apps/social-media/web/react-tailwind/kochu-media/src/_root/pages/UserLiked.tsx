import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";

interface UserContextType {
  user: {
    liked: Array<{
      imageUrl: string | undefined;
      $id: string;
      caption: string;
      post: {
        imageUrl: string;
      };
    }>;
    name: string;
  };
}

const UserLiked = () => {
  const [liked, setLiked] = useState<UserContextType["user"]["liked"]>([]);
  const { user } = useOutletContext<UserContextType>();

  useEffect(() => {
    if (user?.liked) {
      setLiked(user.liked);
    }
  }, [liked]);

  if (!liked || liked.length === 0) {
    return (
      <div>
        <p>No likes yet</p>
      </div>
    );
  }

  return (
    <ul className="grid-container-profile w-full h-full">
      {liked.map((likeItem) => (
        <li key={likeItem.$id} className="relative w-full h-full">
          <Link to={`/post/${likeItem.$id}`} className="grid-post_link_profile">
            <img
              src={likeItem.imageUrl}
              alt={likeItem.caption}
              className="object-cover w-full h-full"
            />
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default UserLiked;
