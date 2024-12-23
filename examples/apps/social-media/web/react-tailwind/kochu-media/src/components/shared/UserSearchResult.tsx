import { Models } from "appwrite";
import BigLoader from "./BigLoader";
import GridUsersList from "./GridUsersList";

type searchPostProps = {
  isSearchFetching: boolean;
  searchedPost?: Models.Document[];
}

const UserSearchResult = ({ isSearchFetching, searchedPost }: searchPostProps) => {

  if (isSearchFetching) return <BigLoader />;

  if (!searchedPost || searchedPost.length === 0) {
    return (
      <p className="text-light-4 mt-10 text-center w-full">
        no result found
      </p>
    );
  }
  //  console.log(searchedPost);
  return (
    <GridUsersList posts={searchedPost} />
  );
}

export default UserSearchResult;
