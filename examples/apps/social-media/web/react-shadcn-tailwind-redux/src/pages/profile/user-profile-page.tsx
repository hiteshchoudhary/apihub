import {
  followUnfollowApi,
  getUserFollowersApi,
  getUserFollowingsApi,
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
  getUserFollowings,
  FollowUnFollowFollwerBeforeRequest,
  FollowUnFollowFollwingBeforeRequest,
  FollowUnFollowFollwerAfterRequest,
  FollowUnFollowFollwingAfterRequest,
} from "@/redux/slices/profileSlice";

import { RootState } from "@/redux/store";
import { requestHandler } from "@/utils";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import PostCard from "@/components/posts/post-card";
import ScrollContainer from "@/components/containers/ScrollContainer";
import { FollowerFollowingCard } from "@/components/users/FollowerFollowingCard";
import MainPageContainer from "@/components/containers/MainPageContainer";

const UserProfilePage = () => {
  const { username: paramsUsername } = useParams();
  const dispatch = useDispatch();
  const {
    userProfile,
    posts,
    hasNextPage,
    totalPosts,
    hasMoreFollowers,
    followers,
    followings,
    hasMoreFollowings,
    initialFollowerFetch,
    initialFollowingFetch,
  } = useSelector((state: RootState) => state.profile);
  const [gettingPosts, setGettingPosts] = useState<boolean>(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get("tab") || "Posts";

  const [loading, setLoading] = useState<boolean>(false);
  const [gettingFollowersOrFollowings, setGettingFollowersOrFollowings] =
    useState<boolean>(false);

  const changeCurrentTab = (tab: string) => {
    setSearchParams({ tab });
  };

  const navigate = useNavigate();

  const followUnFollowHandler = async (
    toBeFollowedUserId: string,
    action: "follow" | "unfollow",
    targetList: "user" | "follower" | "following"
  ) => {
    const dispatchBeforeRequest = {
      user: followUnfollowBeforeRequest,
      follower: FollowUnFollowFollwerBeforeRequest,
      following: FollowUnFollowFollwingBeforeRequest,
    }[targetList];

    const dispatchAfterRequest = {
      user: followUnfollowAfterRequest,
      follower: FollowUnFollowFollwerAfterRequest,
      following: FollowUnFollowFollwingAfterRequest,
    }[targetList];

    dispatch(
      dispatchBeforeRequest({
        action: action,
        userId: toBeFollowedUserId,
      })
    );

    await requestHandler(
      async () => await followUnfollowApi(toBeFollowedUserId),
      null,
      (res) => {
        dispatch(
          dispatchAfterRequest({
            userId: toBeFollowedUserId,
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
          await getUserPostsApi({ page: nextPage, username: paramsUsername! }),
        setGettingPosts,
        (res) => {
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
    if (!paramsUsername) {
      return;
    }

    if (!isFirstPage && (gettingFollowersOrFollowings || !hasMoreFollowers)) {
      return;
    } else {
      await requestHandler(
        async () => await getUserFollowersApi(paramsUsername, nextPage),
        setGettingFollowersOrFollowings,
        (res) => {
          console.log(res.data);
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

  const getUserFollowingsHandler = async (
    isFirstPage: boolean = false,
    nextPage: number
  ) => {
    if (!paramsUsername) {
      return;
    }

    if (!isFirstPage && (gettingFollowersOrFollowings || !hasMoreFollowings)) {
      return;
    } else {
      await requestHandler(
        async () => await getUserFollowingsApi(paramsUsername, nextPage),
        setGettingFollowersOrFollowings,
        (res) => {
          dispatch(
            getUserFollowings({
              followings: res.data.following,
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
      async () => await getUserProfileApi(paramsUsername!),
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

    if (!paramsUsername) {
      navigate("/");
      return;
    }
    if (userProfile && userProfile.account.username === paramsUsername) {
      return;
    } else {
      getUserProfilehandler();
      getUserPostsHandler(true, 1);
    }
  }, [paramsUsername]);

  return (
    <MainPageContainer>
      <div className="relative max-h-[100vh-70px] overflow-y-auto">
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
              !userProfile || userProfile.account.username !== paramsUsername
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
            Loader={FollowerFollowingCard.Skeleton}
            fetchData={getUserFollowerHandler}
            loading={gettingFollowersOrFollowings}
            initialFetch={initialFollowerFetch}
          >
            {followers.map((follower) => (
              <FollowerFollowingCard
                type="follower"
                followUnFollowHandler={followUnFollowHandler}
                userDetails={follower}
                key={follower._id}
              />
            ))}
          </ScrollContainer>
        )}
        {currentTab === "Following" && (
          <ScrollContainer
            hasNextPage={hasMoreFollowings}
            Loader={FollowerFollowingCard.Skeleton}
            fetchData={getUserFollowingsHandler}
            loading={gettingFollowersOrFollowings}
            initialFetch={initialFollowingFetch}
          >
            {followings.map((following) => (
              <FollowerFollowingCard
                type="following"
                followUnFollowHandler={followUnFollowHandler}
                userDetails={following}
                key={following._id}
              />
            ))}
          </ScrollContainer>
        )}
      </div>
    </MainPageContainer>
  );
};

export default UserProfilePage;
