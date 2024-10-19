import { Models } from "appwrite";
import { Link } from "react-router-dom";

type PostListProps = {
  posts: Models.Document[];
};

const GridUsersList = ({ posts }: PostListProps) => {

  return (
    <ul className="max-w-5xl w-full flex flex-col gap-4 px-4">
      {posts?.map((post) => (
        <li
          key={post.$id}
          className="flex w-full items-center bg-dark-2 p-4 rounded-lg shadow-md hover:bg-dark-3 transition-colors"
        >
          <Link
            to={`/profile/${post.$id}`}
            className="flex items-center gap-4 w-full"
          >
            <img
              src={post.imageUrl}
              alt={post.name}
              className="object-cover w-12 h-12 rounded-full border-2 border-light-1"
            />
            <h1 className="text-lg font-medium text-light-1">{post.name}</h1>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default GridUsersList;
