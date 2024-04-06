// required imports
import { Followerinterface, ProfileInterface } from "@/interfaces/profile";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { PostsInterface } from "@/interfaces/posts";
import { UserInterface } from "@/interfaces/authInterface";

// Interface defining the shape of the profile slice state

// Initial state for the profile slice
const initialState: {
  userProfile: ProfileInterface | null;
  posts: PostsInterface[];
  hasNextPage: boolean;
  hasMoreFollowers: boolean;
  totalPosts: number;
  followers: Followerinterface[];
  followings: Followerinterface[];
  hasMoreFollowings: boolean;
  initialFollowerFetch: boolean;
  initialFollowingFetch: boolean;
} = {
  userProfile: null,
  posts: [],
  hasNextPage: true,
  totalPosts: 0,
  hasMoreFollowers: true,
  followers: [],
  followings: [],
  hasMoreFollowings: true,
  initialFollowerFetch: true,
  initialFollowingFetch: true,
};

// Create the profile slice using createSlice from Redux Toolkit
export const profileSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    getUserProfile: (
      state,
      action: PayloadAction<{
        userProfile: ProfileInterface;
      }>
    ) => {
      state.userProfile = action.payload.userProfile;
      state.followers = [];
      state.followings = [];
      state.initialFollowerFetch = true;
      state.initialFollowingFetch = true;
    },

    getUserPosts: (
      state,
      action: PayloadAction<{
        posts: PostsInterface[];
        page: number | null;
        hasNextPage: boolean;
        totalPosts: number;
      }>
    ) => {
      if (action.payload.page === 1) {
        state.posts = action.payload.posts;
      } else {
        state.posts = [...state.posts, ...action.payload.posts];
      }
      state.hasNextPage = action.payload.hasNextPage;
      state.totalPosts = action.payload.totalPosts;
    },

    likeDislikePostBeforeRequest: (
      state,
      action: PayloadAction<{
        postId: string;
      }>
    ) => {
      state.posts = state.posts.map((post) =>
        post._id === action.payload.postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: !post.isLiked ? post.likes + 1 : post.likes - 1,
            }
          : post
      );
    },

    likeDislikePostAfterRequest: (
      state,
      action: PayloadAction<{
        postId: string;
        isLiked: boolean;
      }>
    ) => {
      state.posts = state.posts.map((post) =>
        post._id === action.payload.postId
          ? {
              ...post,
              isLiked: action.payload.isLiked,
            }
          : post
      );
    },

    followUnfollowBeforeRequest: (
      state,
      action: PayloadAction<{ action: "follow" | "unfollow" }>
    ) => {
      if (state.userProfile) {
        state.userProfile = {
          ...state.userProfile,
          isFollowing: action.payload.action === "follow" ? true : false,
          followersCount:
            action.payload.action === "follow"
              ? state.userProfile.followersCount + 1
              : state.userProfile.followersCount - 1,
        };
      }
    },

    followUnfollowAfterRequest: (
      state,
      action: PayloadAction<{ following: boolean }>
    ) => {
      if (state.userProfile) {
        state.userProfile = {
          ...state.userProfile,
          isFollowing: action.payload.following,
        };
      }
    },

    getUserFollowers: (
      state,
      action: PayloadAction<{
        followers: Followerinterface[];
        hasNextPage: boolean;
        page: number | null;
      }>
    ) => {
      if (action.payload.page === 1) {
        state.followers = action.payload.followers;
      } else {
        state.followers = [...state.followers, ...action.payload.followers];
      }
      state.hasMoreFollowers = action.payload.hasNextPage;
      state.initialFollowerFetch = false;
    },

    getUserFollowings: (
      state,
      action: PayloadAction<{
        followings: Followerinterface[];
        hasNextPage: boolean;
        page: number | null;
      }>
    ) => {
      if (action.payload.page === 1) {
        state.followings = action.payload.followings;
      } else {
        state.followings = [...state.followings, ...action.payload.followings];
      }
      state.hasMoreFollowings = action.payload.hasNextPage;
      state.initialFollowingFetch = false;
    },

    FollowUnFollowFollwerBeforeRequest: (
      state,
      action: PayloadAction<{ userId: string; action: "follow" | "unfollow" }>
    ) => {
      state.followers = state.followers.map((follower) =>
        follower._id === action.payload.userId
          ? {
              ...follower,
              isFollowing: action.payload.action === "follow" ? true : false,
            }
          : follower
      );
    },

    FollowUnFollowFollwerAfterRequest: (
      state,
      action: PayloadAction<{ userId: string; following: boolean }>
    ) => {
      state.followers = state.followers.map((follower) =>
        follower._id === action.payload.userId
          ? {
              ...follower,
              isFollowing: action.payload.following,
            }
          : follower
      );
    },

    FollowUnFollowFollwingBeforeRequest: (
      state,
      action: PayloadAction<{ userId: string; action: "follow" | "unfollow" }>
    ) => {
      state.followings = state.followings.map((following) =>
        following._id === action.payload.userId
          ? {
              ...following,
              isFollowing: action.payload.action === "follow" ? true : false,
            }
          : following
      );
    },

    FollowUnFollowFollwingAfterRequest: (
      state,
      action: PayloadAction<{ userId: string; following: boolean }>
    ) => {
      state.followings = state.followings.map((following) =>
        following._id === action.payload.userId
          ? {
              ...following,
              isFollowing: action.payload.following,
            }
          : following
      );
    },

    updateCoverImageSlice: (
      state,
      action: PayloadAction<{ updatedProfile: ProfileInterface }>
    ) => {
      state.userProfile = action.payload.updatedProfile;
    },

    updateUserProfileAvatar: (
      state,
      action: PayloadAction<{ updatedUser: UserInterface }>
    ) => {
      state.userProfile = {
        ...state.userProfile!,
        account: action.payload.updatedUser,
      };
    },
  },
});

// Export action creators
export const {
  getUserProfile,
  getUserPosts,
  likeDislikePostAfterRequest,
  likeDislikePostBeforeRequest,
  followUnfollowBeforeRequest,
  followUnfollowAfterRequest,
  getUserFollowers,
  getUserFollowings,
  FollowUnFollowFollwerAfterRequest,
  FollowUnFollowFollwerBeforeRequest,
  FollowUnFollowFollwingAfterRequest,
  FollowUnFollowFollwingBeforeRequest,
  updateCoverImageSlice,
  updateUserProfileAvatar,
} = profileSlice.actions;

// Export the post reducer
export default profileSlice.reducer;
