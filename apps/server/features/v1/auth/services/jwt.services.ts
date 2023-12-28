import jwt from "jsonwebtoken";
import serverConfig from "../../../../config/server.config";

export type TJwtPrivateTokenType = "accessTokenPrivate" | "refreshTokenPrivate";

export type TJwtPublicTokenType = "accessTokenPublic" | "refreshTokenPublic";

export const singJWT = (
  data: Object,
  key: TJwtPrivateTokenType,
  options?: jwt.SignOptions
) => {
  const signedKey = Buffer.from(serverConfig.token[key], "base64").toString(
    "ascii"
  );

  return jwt.sign(data, signedKey, {
    ...(options && options),
    algorithm: "RS256",
  });
};

export const verifyJwt = <T>(token: string, key: TJwtPublicTokenType) => {
  try {
    const publicKey = Buffer.from(serverConfig.token[key], "base64").toString(
      "ascii"
    );
    const decode = jwt.verify(token, publicKey) as T;
    return decode;
  } catch (err) {
    return null;
  }
};
