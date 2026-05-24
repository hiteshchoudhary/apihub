import { ID, ImageGravity } from "appwrite";
import { INewPost, INewUser, IUpdatePost, IUpdateUser, } from "@/types";
import { account, appwriteConfig, avatars, database, storage } from "./config";
import { Query } from "appwrite";

export async function createUserAccount(user: INewUser) {
   try {
      const newAccount = await account.create(
         ID.unique(),
         user.email,
         user.password,
         user.name,
      )
      if (!newAccount) throw Error;
      const avatarUrl = avatars.getInitials(user.name);

      const newUser = await saveUserToDatabase({
         accountId: newAccount.$id,
         email: newAccount.email,
         name: newAccount.name,
         username: user.username,
         imageUrl: avatarUrl,
      });

      return newUser;
   } catch (error) {
      console.error(error);
      return error;
   }
}

export async function saveUserToDatabase(user: {
   accountId: string,
   email: string,
   name: string,
   imageUrl: URL,
   username?: string,
}) {
   try {
      const newUser = await database.createDocument(
         appwriteConfig.databaseId,
         appwriteConfig.userCollectonId,
         ID.unique(),
         user,
      );

      return newUser;
   } catch (error) {
      console.error(error);
      return error;
   }
}

export async function signInAccount(user: { email: string; password: string }) {
   try {
      // Check if the user already has an active session
      const currentAccount = await getCurrentUser();
      if (currentAccount) {
         // console.log("Session already exists for user:", currentAccount);
         return currentAccount;
      }

      // Create a new session if no active session exists
      const session = await account.createEmailPasswordSession(
         user.email,
         user.password,
      );

      return session;
   } catch (error) {
      console.error("Error signing in:", error);
      return error;
   }
}

// export async function AuthWithGoogle() {
//    try {
//       // Start the Google OAuth process
//       const res = account.createOAuth2Session(
//          'google',
//          'http://localhost:5173/',
//          `http://localhost:5173/sign-up`,
//       );
//       if (!res) throw Error("OAuth2Session failed");

//       // Fetch the current user after OAuth session
//       const currentUser = await getCurrentUser();

//       if (!currentUser) {
//          // If the user doesn't exist, navigate to sign-up page
//          window.location.href = `http://localhost:5173/sign-up`; // Modify to your route
//       } else {
//          // If the user exists, log them in or fetch their details
//          await signInAccount(currentUser);
//       }
//    } catch (error) {
//       console.log("Google Sign-in Error:", error);
//    }
// }


export async function getCurrentUser() {
   try {
      const currentAccount = await account.get();
      if (!currentAccount) {
         return null;
      }
      const currentUser = await database.listDocuments(
         appwriteConfig.databaseId,
         appwriteConfig.userCollectonId,
         [Query.equal('accountId', currentAccount.$id)]
      );
      if (currentUser.documents.length === 0) {
         throw Error;
      }
      return currentUser.documents[0];
   } catch (error) {
      console.error("Error fetching current user:", error);
   }
}


export async function signOutAccount() {
   try {
      const seasion = await account.deleteSession('current');
      // console.log("Session deleted:", seasion);
      return seasion;
   } catch (error) {
      console.log(error);
   }
}

export async function createPost(post: INewPost) {
   try {
      // upload file to appwrite storage 
      // console.log("post object :", post, "file in 0 index", post.file);
      const uploadedFile = await uploadfile(post.file);
      // console.log("this is uploadfile :", uploadedFile);
      if (!uploadedFile) throw Error;
      // get file url
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
         await deleteFile(uploadedFile.$id);
         throw Error;
      }
      // Convert tags into array
      const tags = post.tags?.replace(/ /g, "").split(",") || [];
      // Create post object
      const newPost = await database.createDocument(
         appwriteConfig.databaseId,
         appwriteConfig.postCollectionId,
         ID.unique(),
         {
            creator: post.userId,
            caption: post.caption,
            imageUrl: fileUrl,
            imageId: uploadedFile.$id,
            location: post.location,
            tags: tags,
         }
      )

      if (!newPost) {
         await deleteFile(uploadedFile.$id);
         throw Error;
      }

      return newPost;
   } catch (error) {
      console.log("Error in createPost:", error);
   }
}

// supporting functions that many time will be used 
export async function uploadfile(file: File) {
   console.log("file reciving uploadfile :", file);
   try {
      if (!file) throw new Error("File not provided");

      const uploadedFile = await storage.createFile(
         appwriteConfig.storageId,
         ID.unique(),
         file
      );
      // console.log("Uploaded file:", uploadedFile);
      return uploadedFile;
   } catch (error) {
      console.log('Error uploading file:', error);
   }
}


export function getFilePreview(fileId: string) {
   try {
      const fileUrl = storage.getFilePreview(
         appwriteConfig.storageId,
         fileId,
         2000,
         2000,
         ImageGravity.Top,
         50,
      );

      if (!fileUrl) throw Error;

      return fileUrl;
   } catch (error) {
      console.log(error);
   }
}

export async function deleteFile(fileId: string) {
   try {
      const deletedFile = await storage.deleteFile(
         appwriteConfig.storageId,
         fileId,
      );
      return deletedFile;
   } catch (error) {
      console.log(error);
   }
}


export async function getRecentPost() {
   try {
      const posts = await database.listDocuments(
         appwriteConfig.databaseId,
         appwriteConfig.postCollectionId,
         [Query.orderDesc('$createdAt'), Query.limit(20)]
      )

      if (!posts) throw Error;
      return posts;
   } catch (error) {
      console.log(error)
   }
}
export async function getPostById(postId: string) {
   try {
      const post = await database.getDocument(
         appwriteConfig.databaseId,
         appwriteConfig.postCollectionId,
         postId
      )
      return post;
   } catch (error) {
      console.log(error);
   }
}
export async function updatePost(post: IUpdatePost) {
   const hasFileToUpdate = post.file && post.file.size > 0;

   try {
      let image = {
         imageUrl: post.imageUrl,
         imageId: post.imageId,
      };

      if (hasFileToUpdate) {
         // Upload new file to Appwrite storage
         // console.log("file in 0 index :", post.file);
         const uploadedFile = await uploadfile(post.file);
         if (!uploadedFile) throw new Error("File upload failed");

         // console.log("this is uploaded file :", uploadedFile);

         // Get new file URL
         const fileUrl = getFilePreview(uploadedFile.$id);
         if (!fileUrl) {
            await deleteFile(uploadedFile.$id);  // Clean up uploaded file
            throw new Error("Failed to generate file URL");
         }

         image = { imageUrl: fileUrl, imageId: uploadedFile.$id };
      }

      // Convert tags into array and trim spaces properly
      const tags = post.tags?.split(",").map(tag => tag.trim()) || [];

      // Update post in the database
      const updatedPost = await database.updateDocument(
         appwriteConfig.databaseId,
         appwriteConfig.postCollectionId,
         post.postId,
         {
            caption: post.caption,
            imageUrl: image.imageUrl,
            imageId: image.imageId,
            location: post.location,
            tags: tags,
         }
      );

      // Failed to update, delete the uploaded file if necessary
      if (!updatedPost) {
         if (hasFileToUpdate) {
            await deleteFile(image.imageId);  // Remove the newly uploaded file
         }
         throw new Error("Failed to update post");
      }

      // Safely delete the old image after successful update
      if (hasFileToUpdate && post.imageId) {
         await deleteFile(post.imageId);  // Clean up the old image file
      }

      return updatedPost;
   } catch (error) {
      console.error("Error updating post:", error);
      throw error;  // Re-throw to handle the error in higher levels
   }
}
export async function updateUser(user: IUpdateUser) {
   // console.log("user in updateUser :", user);
   const hasFileToUpdate = user.file && user.file.size > 0;

   try {
      let image = {
         imageUrl: user.imageUrl,
         imageId: user.imageId,
      };

      if (hasFileToUpdate) {
         const uploadedFile = await uploadfile(user.file);
         if (!uploadedFile) throw new Error("File upload failed");

         // Get new file URL
         const fileUrl = getFilePreview(uploadedFile.$id);
         if (!fileUrl) {
            await deleteFile(uploadedFile.$id);
            throw new Error("Failed to generate file URL");
         }

         image = { imageUrl: fileUrl, imageId: uploadedFile.$id };
      }

      const updatedUser = await database.updateDocument(
         appwriteConfig.databaseId,
         appwriteConfig.userCollectonId,
         user.userId,
         {
            name: user.name,
            bio: user.bio,
            imageUrl: image.imageUrl,
            imageId: image.imageId,
         }
      );
      if (!updatedUser) {
         if (hasFileToUpdate) {
            await deleteFile(image.imageId);
         }
         throw new Error("Failed to update user");
      }
      if (hasFileToUpdate && user.imageId) {
         await deleteFile(user.imageId);
      }

      return updatedUser;
   } catch (error) {
      console.error("Error updating user:", error);
      throw error;
   }

}

export async function deletePost(postId: string, imageId: string) {
   if (!postId || !imageId) throw Error;

   try {
      await database.deleteDocument(
         appwriteConfig.databaseId,
         appwriteConfig.postCollectionId,
         postId
      )

      return { status: "ok" }
   } catch (error) {
      console.log(error)
   }
}


export async function likePosts(postId: string, likesArray: string[]) {
   try {
      const updatedPost = await database.updateDocument(
         appwriteConfig.databaseId,
         appwriteConfig.postCollectionId,
         postId,
         {
            likes: likesArray
         }
      )

      if (!updatedPost) throw Error;
      return updatedPost;
   } catch (error) {
      console.log(error);
   }
}

export async function savePosts(postId: string, userId: string) {
   try {
      const updatePosts = await database.createDocument(
         appwriteConfig.databaseId,
         appwriteConfig.saveCollectionId,
         ID.unique(),
         {
            user: userId,
            post: postId,
         }
      )

      if (!updatePosts) throw Error;
      return updatePosts;
   } catch (error) {
      console.log(error)
   }
}

export async function deleteSavePosts(savePostsId: string) {
   try {
      const statusCode = await database.deleteDocument(
         appwriteConfig.databaseId,
         appwriteConfig.saveCollectionId,
         savePostsId,
      )

      if (!statusCode) throw Error;
      return { status: "ok" };
   } catch (error) {
      console.log(error);
   }
}


// explore
export async function getInFininitePost({ pageParam }: { pageParam?: string | null }) {
   const queries: any[] = [Query.orderDesc('$updatedAt'), Query.limit(9)];
   if (pageParam) {
      queries.push(Query.cursorAfter(pageParam.toString()));
   }
   try {
      const posts = await database.listDocuments(
         appwriteConfig.databaseId,
         appwriteConfig.postCollectionId,
         queries
      )

      if (!posts) throw Error;
      return posts;
   } catch (error) {
      console.log(error)
      throw error;
   }
}
// Fetch infinite users
export async function getInfiniteUsers({ pageParam }: { pageParam?: string | null }) {
   const queries: any[] = [Query.orderDesc('$updatedAt'), Query.limit(10)];
   if (pageParam) {
      queries.push(Query.cursorAfter(pageParam.toString()));
   }
   try {
      const users = await database.listDocuments(
         appwriteConfig.databaseId,
         appwriteConfig.userCollectonId,
         queries
      )

      if (!users) throw Error;
      return users;
   } catch (error) {
      console.log(error);
      throw error;
   }
}
export async function searchPost(searchTerm: string) {
   try {
      const posts = await database.listDocuments(
         appwriteConfig.databaseId,
         appwriteConfig.postCollectionId,
         [Query.search('caption', searchTerm)]
      )

      if (!posts) throw Error;
      return posts;
   } catch (error) {
      console.log(error)
   }
}
// Search for users
export async function searchUsers(searchTerm: string) {
   try {
      const users = await database.listDocuments(
         appwriteConfig.databaseId,
         appwriteConfig.userCollectonId,
         [Query.search('name', searchTerm)]
      )

      if (!users) throw Error;
      return users;
   } catch (error) {
      console.log(error);
   }
}

// user
export async function getUserById(userId: string) {
   try {
      const user = await database.getDocument(
         appwriteConfig.databaseId,
         appwriteConfig.userCollectonId,
         userId
      )

      if (!user) throw Error;
      return user;
   } catch (error) {
      console.log(error)
   }
}

export async function getManyUserByIds(userIds: string[]) {
   try {
      const users = await database.listDocuments(
         appwriteConfig.databaseId,
         appwriteConfig.userCollectonId,
         [Query.equal('accountId', userIds)]
      )

      if (!users) throw Error;
      return users;
   } catch (error) {
      console.log(error)
   }
}

// post a new comment
export async function createNewComment(postId: string, userId: string, comment: string) {
   try {
      const newComment = await database.createDocument(
         appwriteConfig.databaseId,
         appwriteConfig.commentsCollectionId,
         ID.unique(),
         {
            commentater: userId,
            comment: comment,
            posts: postId,
         }
      )

      if (!newComment) throw Error;
      return newComment;
   } catch (error) {
      console.log(error)
   }
}
export async function getCommentsById(postId: string) {
   try {
      const rawComments = await database.listDocuments(
         appwriteConfig.databaseId,
         appwriteConfig.commentsCollectionId,
         [
            Query.equal('posts', postId),
            Query.orderDesc('$createdAt'),
            Query.limit(10)
         ]
      );

      if (!rawComments) throw Error;

      // Filter out unnecessary data
      const comments = rawComments.documents.map((comment) => {
         return {
            _id: comment.$id,
            comment: comment.comment,
            $createdAt: comment.$createdAt,
            Commentlikes: comment.Commentlikes,
            commenter: {
               imageUrl: comment.commentater.imageUrl,
               name: comment.commentater.name,
               username: comment.commentater.username,
               id: comment.commentater.$id,
            }
         };
      });

      return comments;
   } catch (error) {
      console.log(error);
   }
}

export async function likeComment(commentId: string, likesArray: string[]) {
   try {
      const updateComment = await database.updateDocument(
         appwriteConfig.databaseId,
         appwriteConfig.commentsCollectionId,
         commentId,
         {
            likesArray
         }
      )

      if (!updateComment) {
         throw Error
      }
      return updateComment;
   } catch (error) {
      console.log(error);
   }
}