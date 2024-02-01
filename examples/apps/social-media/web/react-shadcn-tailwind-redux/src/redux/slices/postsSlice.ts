// required imports
import { PostsInterface } from "@/interfaces/posts";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

// Interface defining the shape of the post slice state
interface PostSliceInterface {
  posts: PostsInterface[];
  hasNextPage: boolean;
  nextPage: number;
}

// Initial state for the post slice
const initialState: PostSliceInterface = {
  posts: [],
  hasNextPage: false,
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
  },
});

// Export action creators
export const { getPosts } = postsSlice.actions;

// Export the post reducer
export default postsSlice.reducer;
