// required imports
import { getOthersPostApi, likeDislikePostApi } from "@/api";
import ScrollContainer from "../components/containers/ScrollContainer";
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
import MainPageContainer from "@/components/containers/MainPageContainer";

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
    <MainPageContainer>
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
    </MainPageContainer>
  );
};

export default Home;
