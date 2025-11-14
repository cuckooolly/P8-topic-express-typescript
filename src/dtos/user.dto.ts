export type CreateUserDto = {
  email: string;
  name: string;
  password: string;
};

export type LoginUserDto = {
  email: string;
  password: string;
};

export type RefreshTokenDto = {
  refreshToken: string;
};
