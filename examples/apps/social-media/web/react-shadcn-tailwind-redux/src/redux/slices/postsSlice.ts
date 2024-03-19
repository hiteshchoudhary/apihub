// required imports
import { PostsInterface } from "@/interfaces/posts";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

// Interface defining the shape of the post slice state
interface PostSliceInterface {
  posts: PostsInterface[];
  hasNextPage: boolean;
  nextPage: number | null;
}

// Initial state for the post slice
const initialState: PostSliceInterface = {
  posts: [],
  hasNextPage: true,
  nextPage: 1,
};

// Create the post slice using createSlice from Redux Toolkit
export const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    // Action to update the state with new posts, hasNextPage, and nextPage
    getPosts: (
      state,
      action: PayloadAction<{
        posts: PostsInterface[];
        hasNextPage: boolean;
        nextPage: number;
      }>
    ) => {
      // Concatenate the new posts to the existing posts in the state

      if (action.payload.nextPage === 2) {
        state.posts = action.payload.posts;
      } else {
        state.posts = [...state.posts, ...action.payload.posts];
      }

      // Update hasNextPage and nextPage based on the action payload
      state.hasNextPage = action.payload.hasNextPage;
      state.nextPage = action.payload.nextPage;
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
  },
});

// Export action creators
export const {
  getPosts,
  likeDislikePostBeforeRequest,
  likeDislikePostAfterRequest,
} = postsSlice.actions;

// Export the post reducer
export default postsSlice.reducer;
