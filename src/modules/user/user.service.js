import { hashPlainText, isHashTextMatch } from "../../utils/hash.util.js";
import { generateUserAuthToken } from "../../utils/jwt.util.js";
import UserModel from "../../db/models/user.model.js";
import { encryptPlainText } from "../../utils/crypto.util.js";

// 1. Signup (make sure that the email does not exist before) (Don’t forget to hash the password and encrypt the phone). (0.5 Grade)
export const userSignupService = async (request, response) => {
  try {
    const user = request.body || {};

    // encrypt phone
    const { plain: phone, iv: phoneIv } = encryptPlainText(user.phone);

    // hash password
    const hashedPassword = await hashPlainText(user.password);

    // update user data
    Object.assign(user, { phone, phoneIv, password: hashedPassword });
    const createdUser = await UserModel.create(user);

    return response.status(200).json({
      status: "success",
      message: "User Signup Successfully!!",
      data: createdUser.toUserProfile(),
    });
  } catch (error) {
    return response.status(500).json({
      status: "error",
      message: error.message || "Internal Server Error!!",
      ...(error.length > 0 && { error }),
    });
  }
};

// 2. Create an API for authenticating users (Login) and return a JSON Web Token (JWT) that contains the userId and will expire after “1 hour”.(Get the email and the password from the body).(0.5 Grade)
export const userLoginService = async (request, response) => {
  try {
    const { email, password } = request.body || {};

    const foundUser = await UserModel.findOne({ email });
    const isMatchedPassword = await isHashTextMatch(password, foundUser?.password);
    if (!foundUser || !isMatchedPassword) {
      return response.status(400).json({
        status: "error",
        message: "Invalid User Credentials!!",
      });
    }

    const userToken = generateUserAuthToken({ userId: foundUser.id }, "1h");

    return response.status(200).json({
      status: "success",
      message: "User Logged In Successfully!!",
      token: userToken,
    });
  } catch (error) {
    return response.status(500).json({
      status: "error",
      message: error.message || "Internal Server Error!!",
      ...(error.length > 0 && { error }),
    });
  }
};

// 3. Update logged-in user information (Except Password). (If user want to update the email, check the new email doesn’t exist before. (Get the id for the logged-in user (userId) from the token not the body) (send the token in the headers) (0.5 Grade)
export const updateSingleUserService = async (request, response) => {
  try {
    const user = request.user;
    const { phone, password, ...userData } = request.body || {};

    // encrypt phone if exists and update the user data
    if (phone) {
      const { plain, iv } = encryptPlainText(phone);
      Object.assign(userData, { phone: plain, phoneIv: iv });
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      { _id: user.id },
      {
        $set: userData,
        $inc: { __v: 1 },
      },
      { returnDocument: "after" },
    );

    return response.status(200).json({
      status: "success",
      message: "User Updated Successfully!!",
      data: updatedUser.toUserProfile(),
    });
  } catch (error) {
    return response.status(500).json({
      status: "error",
      message: error.message || "Internal Server Error!!",
      ...(error.length > 0 && { error }),
    });
  }
};

// 4. Delete logged-in user. (Get the id for the logged-in user (userId) from the token not the body) (send the token in the headers) (0.5 Grade)
export const deleteSingleUserByTokenService = async (request, response) => {
  try {
    const user = request.user;

    const deletedUser = await UserModel.findByIdAndDelete(user.id);

    return response.status(200).json({
      status: "success",
      message: "User Deleted Successfully!!",
      data: deletedUser.toUserProfile(),
    });
  } catch (error) {
    return response.status(500).json({
      status: "error",
      message: error.message || "Internal Server Error!!",
      ...(error.length > 0 && { error }),
    });
  }
};

// 5. Get logged-in user data by his ID. (Get the id for the logged-in user (userId) from the token not the body) (send the token in the headers) (0.5 Grade)
export const getSingleUserProfileService = async (request, response) => {
  try {
    const user = request.user;

    return response.status(200).json({
      status: "success",
      message: "User Profile Fetched Successfully!!",
      data: user.toObject({
        virtuals: false,
        versionKey: false,
        applyGetters: false,
        transform: (_, { phoneIv, ...user }) => user,
      }),
    });
  } catch (error) {
    return response.status(500).json({
      status: "error",
      message: error.message || "Internal Server Error!!",
      ...(error.length > 0 && { error }),
    });
  }
};
