import BigLoader from "@/components/shared/BigLoader";
import IamThere from "@/components/shared/IamThere";
import PostCard from "@/components/shared/PostCard";
import { useUserContext } from "@/context/AuthContext";
import { useGetRecentPost } from "@/lib/react-query/queriesAndMutation";
import { Models } from "appwrite";
import { Link } from "react-router-dom";

const Home = () => {
  const { user } = useUserContext();
  const { data: posts, isPending: isPostLoading, isError: isErrorPosts } = useGetRecentPost();

  return (
    <>
      {isPostLoading || !posts || isErrorPosts ? (
        <BigLoader />
      ) : (
        <>
          <div className="home-posts overflow-x-hidden overflow-y-auto scroll-smooth">
            <div className="bg-dark-4 rounded-[10px] w-full flex px-3 py-3 justify-evenly items-center gap-3 mt-2">
              <Link to={`/profile/${user.id}`} className="flex items-center justify-center">
                <img
                  width={50}
                  height={50}
                  className="rounded-full object-cover"
                  src={user?.imageUrl || "/assets/images/default-avatar.png"}
                  alt={user?.name}
                  style={{ aspectRatio: '1/1' }}
                />
              </Link>
              <Link
                className="w-full h-12 flex justify-start items-center rounded-[5px] bg-dark-3 border-none"
                to={"/create-post"}
              >
                <p className="text-light-4 px-2">What's on your mind?</p>
              </Link>
            </div>

            <ul className="flex flex-1 flex-col w-full gap-3">
              {posts?.documents?.map((post: Models.Document) => (
                <li key={post.$id}>
                  <PostCard post={post} />
                </li>
              ))}
            </ul>
          </div>
          <IamThere />
        </>
      )}
    </>
  );
};

export default Home;
