import jwt from "jsonwebtoken";
import UserModel from "../db/models/user.model.js";

export const generateUserAuthToken = (user, expire) => {
  return jwt.sign(user, process.env.JWT_SECRET_KEY, {
    expiresIn: expire || process.env.JWT_EXPIRATION,
  });
};

export const verifyUserAuthToken = async (token) => {
  try {
    const { userId } = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    return await UserModel.findById(userId);
  } catch (error) {
    throw new Error("Token Expired!!");
  }
};
