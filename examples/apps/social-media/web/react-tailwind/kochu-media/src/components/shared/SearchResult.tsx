import { Models } from "appwrite";
import BigLoader from "./BigLoader";
import GridPostList from "./GridPostList";
// import { useEffect } from "react";

type searchPostProps = {
  isSearchFetching: boolean;
  searchedPost?: Models.Document[];
}

const SearchResult = ({ isSearchFetching, searchedPost }: searchPostProps) => {

  // useEffect(() => {
  //   console.log(searchedPost);
  // }, [searchedPost]);

  if (isSearchFetching) return <BigLoader />;

  if (!searchedPost || searchedPost.length === 0) {
    return (
      <p className="text-light-4 mt-10 text-center w-full">
        no result found
      </p>
    );
  }

  return (
    <GridPostList posts={searchedPost} />
  );
}

export default SearchResult;
