import {
   useInfiniteQuery,
   // usequery,
   useMutation,
   useQuery,
   useQueryClient,
   // useInfiniteQuery,
} from '@tanstack/react-query'
import { createNewComment, createPost, createUserAccount, deletePost, deleteSavePosts, getCommentsById, getCurrentUser, getInFininitePost, getInfiniteUsers, getManyUserByIds, getPostById, getRecentPost, getUserById, likeComment, likePosts, savePosts, searchPost, searchUsers, signInAccount, signOutAccount, updatePost, updateUser } from '../appwrite/api'
import { INewPost, INewUser, IUpdatePost, IUpdateUser, } from '@/types'
import { QUERY_KEYS } from './queryKeys'


export const useCreateUserAccount = () => {
   return useMutation({
      mutationFn: (user: INewUser) => createUserAccount(user)
   })
}
export const useSignInAccount = () => {
   return useMutation({
      mutationFn: (user: { email: string; password: string }) => signInAccount(user)
   })
}

export const useSignOutAccount = () => {
   return useMutation({
      mutationFn: signOutAccount
   })
}

export const useCreatePost = () => {
   const queryClient = useQueryClient()

   return useMutation({
      mutationFn: (post: INewPost) => createPost(post),
      onSuccess: () => {
         queryClient.invalidateQueries(
            {
               queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            }
         )
      }
   })
}

export const useGetRecentPost = () => {
   return useQuery({
      queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      queryFn: getRecentPost,
   })
}


export const useLikePost = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: ({ postId, likesArray }: { postId: string, likesArray: string[] }) => likePosts(postId, likesArray),
      onSuccess: (data) => {
         queryClient.invalidateQueries(
            {
               queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id]
            }
         )
         queryClient.invalidateQueries(
            {
               queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            }
         )
         queryClient.invalidateQueries(
            {
               queryKey: [QUERY_KEYS.GET_POSTS]
            }
         )
         queryClient.invalidateQueries(
            {
               queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            }
         )
      }
   })
}

export const useLikeComment = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: ({ commentId, likesArray }: { commentId: string, likesArray: string[] }) => likeComment(commentId, likesArray),
      onSuccess: () => {
         queryClient.invalidateQueries(
            {
               queryKey: [QUERY_KEYS.GET_CURRENT_COMMENTS]
            }
         )
         queryClient.invalidateQueries(
            {
               queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            }
         )
      }
   })
}

export const useSavePost = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: ({ postId, userId }: { postId: string, userId: string }) => savePosts(postId, userId),
      onSuccess: () => {
         queryClient.invalidateQueries(
            {
               queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            }
         )
         queryClient.invalidateQueries(
            {
               queryKey: [QUERY_KEYS.GET_POSTS]
            }
         )
         queryClient.invalidateQueries(
            {
               queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            }
         )
      }
   })
}
export const useDeleteSavePost = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: (savePostsId: string) => deleteSavePosts(savePostsId),
      onSuccess: () => {
         queryClient.invalidateQueries(
            {
               queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            }
         )
         queryClient.invalidateQueries(
            {
               queryKey: [QUERY_KEYS.GET_POSTS]
            }
         )
         queryClient.invalidateQueries(
            {
               queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            }
         )
      }
   })
}

export const useGetCurrentUser = () => {
   return useQuery({
      queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      queryFn: getCurrentUser,
   });
};

export const useGetCurrentUserPosts = () => {
   return useQuery({
      queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      queryFn: getCurrentUser,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
   });
};


export const useGetPostById = (postId: string) => {
   return useQuery({
      queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
      queryFn: () => getPostById(postId),
      enabled: !!postId,
   })
}

export const useUpdatePost = () => {
   const queryClient = useQueryClient()
   return useMutation({
      mutationFn: (post: IUpdatePost) => updatePost(post),
      onSuccess: (data) => {
         queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id]
         })
      }
   })
}

export const useUpdateProfile = () => {
   const queryClient = useQueryClient()
   return useMutation({
      mutationFn: (user: IUpdateUser) => updateUser(user),
      onSuccess: () => {
         queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_CURRENT_USER]
         })
      }
   })
}

export const useDeletePost = () => {
   const queryClient = useQueryClient()
   return useMutation({
      mutationFn: ({ postId, imageId }: { postId: string, imageId: string }) => deletePost(postId, imageId),
      onSuccess: () => {
         queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
         })
      }
   })
}

//  expore
export const useGetPosts = () => {
   return useInfiniteQuery({
      queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
      queryFn: getInFininitePost,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      getNextPageParam: (lastPage) => {
         if (lastPage && lastPage.documents.length === 0) return null;
         const lastId = lastPage?.documents[lastPage.documents.length - 1].$id;
         return lastId ?? null;
      },
      initialPageParam: null
   })
}
// Infinite query to fetch users
export const useGetUsers = () => {
   return useInfiniteQuery({
      queryKey: [QUERY_KEYS.GET_USERS],
      queryFn: getInfiniteUsers,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      getNextPageParam: (lastPage) => {
         if (lastPage && lastPage.documents.length === 0) return null;
         const lastId = lastPage?.documents[lastPage.documents.length - 1].$id;
         return lastId ?? null;
      },
      initialPageParam: null
   });
}

export const useSearchPost = (searchTurm: string) => {
   return useQuery({
      queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTurm],
      queryFn: () => searchPost(searchTurm),
      enabled: !!searchTurm
   })
}
export const useSearchUsers = (searchTurm: string) => {
   return useQuery({
      queryKey: [QUERY_KEYS.SEARCH_USERS, searchTurm],
      queryFn: () => searchUsers(searchTurm),
      enabled: !!searchTurm
   })
}
// users
export const useGetUserById = (userId: string) => {
   return useQuery({
      queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
      queryFn: () => getUserById(userId),
      enabled: !!userId,
   })
}

export const useGetManyUserById = (userIds: string[]) => {
   return useQuery({
      queryKey: [QUERY_KEYS.GET_MANY_USER_BY_IDS, userIds],
      queryFn: () => getManyUserByIds(userIds),
      enabled: !!userIds
   })
}

// comments on post 
export const usePostComment = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: ({ postId, userId, comment }: { postId: string, userId: string, comment: string }) => createNewComment(postId, userId, comment),
      onSuccess: () => {
         queryClient.invalidateQueries(
            {
               queryKey: [QUERY_KEYS.GET_CURRENT_COMMENTS]
            }
         )
      }
   })
}

// get all comments on post 
export const useGetCommentsById = (postId: string) => {
   return useQuery({
      queryKey: [QUERY_KEYS.GET_CURRENT_COMMENTS, postId],
      queryFn: () => getCommentsById(postId),
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      enabled: !!postId
   })
}