export type JWTPayload = {
  id: string;
  role: string;
  aud?: number;
  exp?: number;
  iat?: number;
  iss?: number;
  jti?: number;
  nbf?: number;
  sub?: number;
};
