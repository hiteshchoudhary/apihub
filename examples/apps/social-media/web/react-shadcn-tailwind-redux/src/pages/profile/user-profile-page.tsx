import {
  followUnfollowApi,
  getUserFollowersApi,
  getUserPostsApi,
  getUserProfileApi,
  likeDislikePostApi,
} from "@/api";

import ProfileCard from "@/components/users/ProfileCard";
import {
  getUserPosts,
  getUserProfile,
  likeDislikePostBeforeRequest,
  likeDislikePostAfterRequest,
  followUnfollowBeforeRequest,
  followUnfollowAfterRequest,
  getUserFollowers,
} from "@/redux/slices/profileSlice";

import { RootState } from "@/redux/store";
import { requestHandler } from "@/utils";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import PostCard from "@/components/posts/post-card";
import ScrollContainer from "@/components/containers/ScrollContainer";
import FollowerFollowingCard from "@/components/users/FollowerFollowingCard";

const UserProfilePage = () => {
  const { username } = useParams();
  const dispatch = useDispatch();
  const {
    userProfile,
    posts,
    hasNextPage,
    totalPosts,
    hasMoreFollowers,
    followers,
  } = useSelector((state: RootState) => state.profile);
  const [gettingPosts, setGettingPosts] = useState<boolean>(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get("tab") || "Posts";

  const [loading, setLoading] = useState<boolean>(false);
  const [gettingFollowers, setGettingFollowers] = useState<boolean>(false);

  const changeCurrentTab = (tab: string) => {
    setSearchParams({ tab });
  };

  const navigate = useNavigate();

  const followUnFollowHandler = async (
    toBeFollowedUserId: string,
    action: "follow" | "unfollow"
  ) => {
    dispatch(
      followUnfollowBeforeRequest({
        action: action,
      })
    );

    await requestHandler(
      async () => await followUnfollowApi(toBeFollowedUserId),
      null,
      (res) => {
        dispatch(
          followUnfollowAfterRequest({
            following: res.data.following,
          })
        );
      },
      (error) => {
        toast.error(error);
      }
    );
  };

  const getUserPostsHandler = async (
    isFirstPage: boolean = false,
    nextPage: number
  ) => {
    if (!isFirstPage && (loading || !hasNextPage)) {
      return;
    } else {
      await requestHandler(
        async () =>
          await getUserPostsApi({ page: nextPage, username: username! }),
        setGettingPosts,
        (res) => {
          console.log(res.data);

          dispatch(
            getUserPosts({
              posts: res.data.posts,
              page: res.data.page,
              hasNextPage: res.data.hasNextPage,
              totalPosts: res.data.totalPosts,
            })
          );
        },
        (error) => {
          toast.error(error);
        }
      );
    }
  };

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

  const getUserFollowerHandler = async (
    isFirstPage: boolean = false,
    nextPage: number
  ) => {
    console.log("getting followers");
    if (!username) {
      return;
    }

    if (!isFirstPage && (gettingFollowers || !hasMoreFollowers)) {
      return;
    } else {
      await requestHandler(
        async () => await getUserFollowersApi(username, nextPage),
        setGettingFollowers,
        (res) => {
          dispatch(
            getUserFollowers({
              followers: res.data.followers,
              hasNextPage: res.data.hasNextPage,
              page: res.data.page,
            })
          );
        },
        (error) => {
          toast.error(error);
        }
      );
    }
  };

  const getUserProfilehandler = async () => {
    await requestHandler(
      async () => await getUserProfileApi(username!),
      setLoading,
      (res) => {
        dispatch(
          getUserProfile({
            userProfile: res.data,
          })
        );
      },
      (error) => {
        toast.error(error);
        navigate("/");
      }
    );
  };

  useEffect(() => {
    setSearchParams({ tab: "Posts" });

    if (!username) {
      navigate("/");
      return;
    }
    if (userProfile && userProfile.account.username === username) {
      return;
    } else {
      getUserProfilehandler();
    }
  }, []);

  // UseEffect to set up IntersectionObserver for infinite scrolling

  return (
    <div className=" md:container flex justify-start overflow-y-auto md:absolute md:top-[70px] md:left-[150px] lg:left-[200px] max-h-[calc(100vh-70px)] md:max-w-[calc(100vw-150px)] lg:max-w-[calc(100vw-200px)]  p-2 pt-3 md:p-3">
      <div className="self-start  lg:container p-0 md:ml-0 ">
        <div className="max-h-[100vh-70px] overflow-y-auto">
          {/* USER INFO */}
          {loading ? <ProfileCard.Skeleton /> : null}
          {userProfile && !loading && (
            <ProfileCard
              currentTab={currentTab}
              changeCurrentTab={changeCurrentTab}
              followUnFollowHandler={followUnFollowHandler}
              profile={userProfile}
              totalPosts={totalPosts}
            />
          )}

          {currentTab === "Posts" && (
            <ScrollContainer
              hasNextPage={hasNextPage}
              Loader={PostCard.Skeleton}
              fetchData={getUserPostsHandler}
              loading={gettingPosts}
              initialFetch={
                !userProfile || userProfile.account.username !== username
              }
            >
              {posts.map((post) => (
                <PostCard key={post._id} post={post} onLike={likePostHandler} />
              ))}
            </ScrollContainer>
          )}

          {currentTab === "Followers" && (
            <ScrollContainer
              hasNextPage={hasMoreFollowers}
              Loader={PostCard.Skeleton}
              fetchData={getUserFollowerHandler}
              loading={gettingFollowers}
              initialFetch={
                !userProfile || userProfile.account.username !== username
              }
            >
              {followers.map((follower) => (
                <FollowerFollowingCard
                  userDetails={follower}
                  key={follower._id}
                />
              ))}
            </ScrollContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
