import { ImageInterface } from "./image";
export interface PostAuthorInterface {
  account: {
    avatar: ImageInterface;
    email: string;
    username: string;
    _id: string;
  };
  bio: string;
  countryCode?: string;
  coverImage: ImageInterface;
  dob: string;
  firstName: string;
  lastName: string;
  location: string;
  owner: string;
  phoneNumber?: string;
  updatedAt: string;
  _id: string;
}

export interface CommentsInterface {}

export interface PostsInterface {
  _id: string;
  author: PostAuthorInterface;
  comments: number;
  content: string;
  isBookmarked: boolean;
  isLiked: boolean;
  likes: number;
  tags: string[];
  updatedAt: string;
  images: ImageInterface[];
}
