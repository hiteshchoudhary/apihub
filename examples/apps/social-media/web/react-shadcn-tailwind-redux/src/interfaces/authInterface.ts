import { ImageInterface } from "./image";

export interface UserInterface {
  _id: string;
  avatar: ImageInterface;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  isEmailverified: boolean;
}

export interface AuthSliceInitialStateInterface {
  user: UserInterface | null;
  token: string | null;
  loadingUser: boolean;
}
