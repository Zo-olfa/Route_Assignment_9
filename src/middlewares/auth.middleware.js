import { verifyUserAuthToken } from "../utils/jwt.util.js";

export const authorizationMiddleware = async (request, response, next) => {
  try {
    const authorize = request.headers[process.env.JWT_AUTH_HEADER].split(" ");
    const token = authorize[1] ?? authorize[0];
    if (!token) {
      throw new Error("Token Not Found!!");
    }

    const user = await verifyUserAuthToken(token, next);
    if (!user) {
      return response.status(404).json({ status: "error", message: "User Not Found!!" });
    }

    request.user = user;
    next();
  } catch (error) {
    return response
      .status(401)
      .json({ status: "error", message: error.message || "Authorization Access Denied." });
  }
};
