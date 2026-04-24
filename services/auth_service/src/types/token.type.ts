interface JwtTokens {
  accessToken: string;
  refreshToken: string;
}

interface DBToken {
  id: string;
  user_id: string;
  token: string;
  is_used: boolean;
  purpose: "Register" | "Password Reset";
  created_at: Date;
  expires_at: Date;
  used_at: Date | null;
}

export { JwtTokens, DBToken };
