import BigLoader from "@/components/shared/BigLoader";
// import FollowBtn from "@/components/shared/FollowBtn";
import Loader from "@/components/shared/Loader";
import { useUserContext } from "@/context/AuthContext";
import { useGetUserById } from "@/lib/react-query/queriesAndMutation";
import { Link, NavLink, Outlet, useNavigate, useParams } from "react-router-dom";

const Profile = () => {
   const navigate = useNavigate();
   const { user: CurrentUser, isLoading: currentUserLoading } = useUserContext();
   const { id } = useParams();
   const { data: user, isFetching } = useGetUserById(id || '');

   return (
      <>

         <div className="common-container">
            <div className="max-w-5xl flex-start gap-3 justify-start w-full">
               <button onClick={() => navigate(-1)}>
                  <img width={30} src="/assets/icons/arrow.svg" alt="back-btn" />
               </button>
               {isFetching ? (null) : (
                  <p className="body-medium  text-left w-full">
                     {user?.name}
                  </p>
               )
               }

            </div>

            {isFetching ? (
               <div className="w-full h-full justify-start items-center">
                  <BigLoader />
               </div>
            ) : (
               <>
                  <div className="max-w-5xl flex gap-6 lg:gap-10 w-full">
                     <img
                        className="w-14 h-14 rounded-full md:w-18 md:h-18 lg:w-20 lg:h-20"
                        src={user?.imageUrl}
                        alt={user?.name}
                     />
                     <div className="flex flex-col w-full">
                        <div className=" flex flex-1 w-full justify-between">
                           <div className="flex flex-col w-full">
                              <h2 className="body-medium lg:h3-bold  font-bold text-left w-full">{user?.name}</h2>
                              <p className="subtle-semibold lg:small-semibold text-light-3">@{user?.username}</p>
                           </div>
                           <div className="flex">
                              {currentUserLoading ? (
                                 <Loader />
                              ) : (
                                 <>
                                    {/* {CurrentUser?.id !== user?.$id && (
                                    <FollowBtn />
                                 )} */}
                                    {/* Show Edit button only for your own profile */}
                                    {CurrentUser?.id === user?.$id && (
                                       <Link to={`/update-profile/${user?.$id}`}>
                                          <img
                                             width={30}
                                             height={30}
                                             src="/assets/icons/settings.svg"
                                             alt="Edit Profile"
                                          />
                                       </Link>
                                    )}
                                 </>
                              )}
                           </div>
                        </div>
                        <p className="my-2 small-medium lg:body-medium ">bio : {user?.bio}</p>
                        <div className="w-full h-fit flex gap-5 my-2 small-medium lg:body-medium ">
                           <p>{user?.posts.length} posts</p>
                           {/* <p>{user?.followers.length} followers</p>
                           <p>{user?.following.length} following</p> */}
                           <p>0 followers</p>
                           <p>0 following</p>
                        </div>
                     </div>
                  </div>
                  <div className="profile-navbar_box">
                     <NavLink
                        className={({ isActive }) =>
                           `w-fit h-fit ${isActive ? "font-bold text-primary-500" : ""}`
                        }
                        to={`/profile/${user?.$id}`}
                        end
                     >
                        Posts
                     </NavLink>
                     <NavLink
                        className={({ isActive }) =>
                           `w-fit h-fit ${isActive ? "font-bold text-primary-500" : ""}`
                        }
                        to={`/profile/${user?.$id}/likes`}
                     >
                        Liked
                     </NavLink>
                     <NavLink
                        className={({ isActive }) =>
                           `w-fit h-fit ${isActive ? "font-bold text-primary-500" : ""}`
                        }
                        to={`/profile/${user?.$id}/saves`}
                     >
                        Saves
                     </NavLink>
                  </div>
                  <section>
                     <Outlet context={{ user }} />
                  </section>
               </>
            )
            }
         </div>
      </>
   );
};

export default Profile;
