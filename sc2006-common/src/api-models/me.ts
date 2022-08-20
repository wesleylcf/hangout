export interface SignUpRes {
  error?: string;
}

export interface LoginRes {
  jwtToken: string;
}

export interface AuthUserReq {
  username: string;
  password: string;
}
