import { ImageClass } from "../product/ProductTypes";

/* LOGIN TYPES */
export enum LOGIN_TYPES {
  emailPassword = "EMAIL_PASSWORD",
  github = "GITHUB",
  google = "GOOGLE",
}

/* USER ROLES */
export enum USER_ROLES {
  admin = "ADMIN",
  user = "USER",
}

export class LoginResp {
  constructor(
    public accessToken: string,
    public refreshToken: string,
    public user: User
  ) {}
}

export class RefreshTokenResp {
  constructor(
    public accessToken: string,
    public refreshToken: string,
  ){
    
  }
}

export class User {
  constructor(
    public _id: string,
    public __v: number,
    public avatar: ImageClass,
    public createdAt: string,
    public email: string,
    public isEmailVerified: boolean,
    public loginType: LOGIN_TYPES,
    public role: USER_ROLES,
    public updatedAt: string,
    public username: string
  ) {}
}
