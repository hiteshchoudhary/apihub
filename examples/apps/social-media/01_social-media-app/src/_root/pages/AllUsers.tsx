import BigLoader from "@/components/shared/BigLoader";
import Loader from "@/components/shared/Loader";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/useDbounce";
import { useGetUsers, useSearchUsers } from "@/lib/react-query/queriesAndMutation";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import UserSearchResult from "@/components/shared/UserSearchResult";
import GridUsersList from "@/components/shared/GridUsersList";

const AllUsers = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const deBouncedValue = useDebounce(searchValue, 500);
  // query params
  const { data: searchedPost, isFetching: isSearchFetching } = useSearchUsers(deBouncedValue);
  const { data: users, fetchNextPage, hasNextPage } = useGetUsers();
  const documents = searchedPost?.documents || [];
  // inView
  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView && !searchValue) {
      fetchNextPage();
    }
  }, [inView, searchValue])
  const shouldShowSearchResults = searchValue !== '';
  const noPostsAvailable = !shouldShowSearchResults && users?.pages.every(page => (page?.documents ?? []).length === 0);

  return (
    <div className="explore-container" >
      <div className="explore-inner_container">
        <div className="max-w-5xl flex-start gap-5 justify-start w-full">
          <button onClick={() => navigate(-1)}>
            <img
              width={30}
              src="/assets/icons/arrow.svg"
              alt="back-btn"
            />
          </button>
          {
            (!users && !shouldShowSearchResults) ? (
              null
            ) : (
              <h1 className="h3-bold md:h2-bold text-left w-full">
                People
              </h1>

            )
          }
        </div>
        {
          (!users && !shouldShowSearchResults) ? (
            <BigLoader />
          ) : (
            <>
              <div className="flex gap-1 px-4 w-full rounded-full bg-dark-4">
                <img
                  src="/assets/icons/search.svg"
                  width={24}
                  height={24}
                  alt="search"
                />
                <Input
                  type="text"
                  placeholder="Search"
                  className="explore-search"
                  onChange={(e) => {
                    const { value } = e.target;
                    setSearchValue(value);
                  }}
                />
              </div>
              <div className="flex-between w-full max-w-5xl mt-1 mb-7">
                <h3>Popular Today</h3>
                <div className="flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer">
                  <p className="small-medium md:base-medium text-light-2">All</p>
                  <img
                    src="/assets/icons/filter.svg"
                    width={20}
                    height={20}
                    alt="filter"
                  />
                </div>
              </div>
            </>
          )
        }
      </div>
      <div className="flex flex-wrap gap-9 w-full max-w-5xl">
        {
          shouldShowSearchResults ? (
            <UserSearchResult
              isSearchFetching={isSearchFetching}
              searchedPost={documents}
            />
          ) : noPostsAvailable ? (
            <p>No posts available</p>
          ) : (
            users?.pages.map((page, index) => (
              (page?.documents ?? []).length > 0 ? (
                <GridUsersList key={`page-${index}`} posts={page?.documents ?? []} />
              ) : null
            ))
          )
        }
      </div>
      {
        hasNextPage && !searchValue && (
          <div ref={ref} className="mt-10">
            <Loader />
          </div>
        )
      }
    </div >
  )
}

export default AllUsers