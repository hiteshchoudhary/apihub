import BigLoader from "@/components/shared/BigLoader";
import { useGetCurrentUserPosts } from "@/lib/react-query/queriesAndMutation";
import { useEffect, useState, Key } from "react";
import { Link, useNavigate } from "react-router-dom";

const Saved = () => {
  const navigate = useNavigate();
  const { data: user, isFetching: isLoading } = useGetCurrentUserPosts();
  const [save, setSave] = useState<
    {
      $id: string; post: {
        $id: Key | null | undefined;
        caption: string | undefined; imageUrl: string
      }; caption: string
    }[]
  >([]);

  useEffect(() => {
    if (user && user.save) {
      setSave(user.save);
      // console.log('user.save', user)
    }
  }, [user]);

  return (
    <div className="common-container">
      <div className="max-w-5xl flex-start gap-5 justify-start w-full">
        <button onClick={() => navigate(-1)}>
          <img
            width={30}
            src="/assets/icons/arrow.svg"
            alt="back-btn"
          />
        </button>
        {
          isLoading ? (null) : (
            <h1 className="h3-bold md:h2-bold text-left w-full">
              Saved post
            </h1>
          )
        }
      </div>
      {
        isLoading ? (
          <BigLoader />
        ) : (
          <>
            <ul className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 max-w-5xl">
              {save.map((savedItem) => (
                savedItem.post ? ( // Check if savedItem.post exists
                  <li key={savedItem.post.$id} className="relative">
                    <Link to={`/post/${savedItem.post.$id}`} className="grid-post_link_profile block overflow-hidden rounded-lg">
                      <img
                        src={savedItem.post.imageUrl}
                        alt={savedItem.post.caption}
                        className="object-cover w-full sm:h-56 md:h-64 lg:h-72 rounded-[10px]"
                      />
                    </Link>
                  </li>
                ) : (
                  <h1>no saved are there</h1>
                )
              ))}
            </ul>
            {
              save.length > 0 ? (
                <p>Add more</p>
              ) : (
                <p>No saved post yet</p>
              )
            }
          </>
        )
      }
      {
        !save || save.length === 0 || isLoading && (
          <div className="w-full h-full flex justify-center items-center">
            <p>No saved post yet</p>
          </div>
        )
      }
    </div>
  );
};

export default Saved;
