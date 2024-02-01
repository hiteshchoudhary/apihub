// required imports
import { getOthersPostApi } from "@/api";
import CreatePostCard from "@/components/posts/create-post-card";
import PostCard from "@/components/posts/post-card";
import { getPosts } from "@/redux/slices/postsSlice";
import { RootState } from "@/redux/store";
import { requestHandler } from "@/utils";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

const Home = () => {
  // Redux hooks to access the posts state
  const { posts, hasNextPage } = useSelector((state: RootState) => state.posts);
  const dispatch = useDispatch();

  // Refs for observing the target element and handling scroll
  const observerTarget = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // State to manage loading state and page number
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<number>(1);

  // Function to fetch posts from the API
  const fetchPosts = async (isFirstPage: boolean = false, nextPage: number) => {
    // Check if it's the first page or loading is ongoing or there are no more pages
    if (!isFirstPage && (loading || !hasNextPage)) {
      return;
    } else {
      // Make the API request using requestHandler utility
      await requestHandler(
        async () => await getOthersPostApi({ page: nextPage }),
        setLoading,
        (res) => {
          // Dispatch the action to update the Redux store with new posts data
          dispatch(
            getPosts({
              posts: res.data.posts,
              hasNextPage: res.data.hasNextPage,
              nextPage: res.data.nextPage,
            })
          );
        },
        (error) => {
          // Display an error toast if the API request fails
          toast.error(error);
        }
      );
    }
  };

  // useEffect to fetch posts when the page number changes
  useEffect(() => {
    fetchPosts(page === 1, page);
  }, [page]);

  // UseEffect to set up IntersectionObserver for infinite scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // If the target element is intersecting, increment the page number
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );
    // Start observing the target element
    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }
    // Clean up observer on component unmount
    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [observerTarget]);

  return (
    <div
      ref={scrollRef}
      className=" container overflow-y-auto flex justify-start md:absolute md:top-[70px] md:left-[150px] lg:left-[200px] max-h-[calc(100vh-70px)] md:max-w-[calc(100vw-150px)] lg:max-w-[calc(100vw-200px)] p-3"
    >
      <div className="self-start container ml-0">
        <div className="max-h-[100vh-70px] overflow-y-auto">
          <CreatePostCard />

          <div className="flex flex-col gap-2">
            {posts.length > 0 ? (
              <>
                {posts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </>
            ) : null}

            {loading && (
              <>
                <PostCard.Skeleton />
                <PostCard.Skeleton />
                <PostCard.Skeleton />
              </>
            )}
            <div ref={observerTarget}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
