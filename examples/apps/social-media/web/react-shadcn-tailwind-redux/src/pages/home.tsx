// required imports
import { getOthersPostApi, likeDislikePostApi } from "@/api";
import ScrollContainer from "@/components/containers/ScrollContainer";
import CreatePostCard from "@/components/posts/create-post-card";
import PostCard from "@/components/posts/post-card";
import {
  getPosts,
  likeDislikePostAfterRequest,
  likeDislikePostBeforeRequest,
} from "@/redux/slices/postsSlice";
import { RootState } from "@/redux/store";
import { requestHandler } from "@/utils";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

const Home = () => {
  // Redux hooks to access the posts state
  const { posts, hasNextPage } = useSelector((state: RootState) => state.posts);
  const dispatch = useDispatch();

  // State to manage loading state and page number
  const [loading, setLoading] = useState(false);

  const likePostHandler = async (postId: string) => {
    dispatch(
      likeDislikePostBeforeRequest({
        postId: postId,
      })
    );

    await requestHandler(
      async () => await likeDislikePostApi(postId),
      null,
      (res) => {
        dispatch(
          likeDislikePostAfterRequest({
            postId: postId,
            isLiked: res.data.isLiked,
          })
        );
      },
      (error) => {
        toast.error(error);
      }
    );
  };

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

  return (
    <div className=" container overflow-y-auto flex justify-start md:absolute md:top-[70px] md:left-[150px] lg:left-[200px] max-h-[calc(100vh-70px)] md:max-w-[calc(100vw-150px)] lg:max-w-[calc(100vw-200px)] p-3">
      <div className="self-start container ml-0">
        <div className="max-h-[100vh-70px] overflow-y-auto">
          <CreatePostCard />

          <ScrollContainer
            hasNextPage={hasNextPage}
            Loader={PostCard.Skeleton}
            fetchData={fetchPosts}
            loading={loading}
            initialFetch={posts.length === 0}
          >
            {posts.map((post) => (
              <PostCard key={post._id} post={post} onLike={likePostHandler} />
            ))}
          </ScrollContainer>
        </div>
      </div>
    </div>
  );
};

export default Home;
