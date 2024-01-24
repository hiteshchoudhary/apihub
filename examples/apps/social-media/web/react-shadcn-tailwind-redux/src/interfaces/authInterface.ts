export interface UserInterface {
  _id: string;
  avatar: {
    url: string;
    localPath: string;
  };
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthSliceInitialStateInterface {
  user: UserInterface | null;
  token: string | null;
  loadingUser: boolean;
}
