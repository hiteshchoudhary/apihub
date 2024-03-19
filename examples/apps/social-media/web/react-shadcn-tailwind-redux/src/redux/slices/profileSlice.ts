// required imports
import { Followerinterface, ProfileInterface } from "@/interfaces/profile";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { PostsInterface } from "@/interfaces/posts";
import { arch } from "os";

// Interface defining the shape of the profile slice state

// Initial state for the profile slice
const initialState: {
  userProfile: ProfileInterface | null;
  posts: PostsInterface[];
  hasNextPage: boolean;
  hasMoreFollowers: boolean;
  totalPosts: number;
  followers: Followerinterface[];
} = {
  userProfile: null,
  posts: [],
  hasNextPage: true,
  totalPosts: 0,
  hasMoreFollowers: true,
  followers: [],
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
} = profileSlice.actions;

// Export the post reducer
export default profileSlice.reducer;
