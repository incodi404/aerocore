interface User {
  id: string;
  user_id: string;
  name: string;
  email: string;
}

interface JwtTokens {
  accessToken: string;
  refreshToken: string;
}

export { User, JwtTokens };
