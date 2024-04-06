// TODO: Combine interfaces

import { UserInterface } from "./authInterface";
import { ImageInterface } from "./image";

export interface ProfileInterface {
  _id: string;
  coverImage: ImageInterface;
  firstName: string;
  lastName: string;
  bio: string;
  dob: string;
  location: string;
  countryCode: string;
  phoneNumber: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
  account: UserInterface;
}

export type Followerinterface = Omit<
  UserInterface,
  "createdAt" | "updatedAt" | "isEmailverified"
> & {
  profile: Omit<
    ProfileInterface,
    "followersCount" | "followingCount" | "isFollowing" | "account"
  >;
  isFollowing: boolean;
};

// {
//   "_id": "64fc5a230de4821c6034fc54",
//   "avatar": {
//       "url": "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/270.jpg",
//       "localPath": "",
//       "_id": "64fc5a230de4821c6034fc55"
//   },
//   "username": "kevin_satterfield62",
//   "email": "gage.champlin@gmail.com",
//   "profile": {
//       "_id": "64fc5a240de4821c6034fd20",
//       "coverImage": {
//           "url": "https://via.placeholder.com/800x450.png",
//           "localPath": "",
//           "_id": "64fc5a240de4821c6034fd1f"
//       },
//       "firstName": "Blake",
//       "lastName": "Lebsack",
//       "bio": "dreamer, developer, author",
//       "dob": "2017-12-17T04:17:12.592Z",
//       "location": "Emmerichtown, Romania",
//       "countryCode": "+91",
//       "phoneNumber": "9819235671",
//       "owner": "64fc5a230de4821c6034fc54",
//       "createdAt": "2023-09-09T11:42:28.412Z",
//       "updatedAt": "2024-01-24T13:47:08.003Z",
//       "__v": 0
//   },
//   "isFollowing": false
// },
