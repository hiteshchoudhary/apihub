import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";

interface UserContextType {
  user: {
    save: Array<{
      $id: string;
      caption: string;
      post: {
        imageUrl: string;
      };
    }>;
    name: string;
  };
}

const UserSaved = () => {
  const [save, setSave] = useState<UserContextType["user"]["save"]>([]);
  const { user } = useOutletContext<UserContextType>();

  useEffect(() => {
    if (user?.save) {
      setSave(user.save);
    }
  }, [user]);

  if (!save || save.length === 0) {
    return (
      <div>
        <p>No saves yet</p>
      </div>
    );
  }

  return (
    <ul className="grid-container-profile max-w-5xl flex-start">
      {
        save.map((savedItem) => (
          <li key={savedItem.$id} className="rrelative w-full h-full">
            <Link to={`/post/${savedItem.$id}`} className="grid-post_link_profile">
              {savedItem.post && (
                <img
                  src={savedItem.post.imageUrl}
                  alt={savedItem.caption}
                  className="object-cover w-full h-full"
                />
              )}
            </Link>
          </li>
        ))
      }
    </ul>
  );
};

export default UserSaved;
