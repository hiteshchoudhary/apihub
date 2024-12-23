import {
   Client,
   Account,
   Databases,
   Storage,
   Avatars
} from 'appwrite';

export const appwriteConfig = {
   projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
   url: import.meta.env.VITE_APPWRITE_URL,
   storageId: import.meta.env.VITE_APPWRITE_STORAGE_ID,
   databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
   saveCollectionId: import.meta.env.VITE_APPWRITE_SAVE_COLLECTION_ID,
   userCollectonId: import.meta.env.VITE_APPWRITE_USER_COLLECTION_ID,
   postCollectionId: import.meta.env.VITE_APPWRITE_POST_COLLECTION_ID,
   commentsCollectionId: import.meta.env.VITE_APPWRITE_COMMENTS_COLLECTION_ID,
};

export const client = new Client();
client.setProject(appwriteConfig.projectId);
client.setEndpoint(appwriteConfig.url);

export const account = new Account(client);
export const database = new Databases(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);