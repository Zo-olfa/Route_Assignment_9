import { Router } from "express";
import * as userService from "./user.service.js";
import { authorizationMiddleware } from "../../middlewares/auth.middleware.js";
import { validationMiddleware } from "../../middlewares/validate.middleware.js";

const router = Router();

router.get("/welcome", (_, response) =>
  response.status(200).json({ status: "success", message: "Welcome to Users API!" }),
);

// • URL: POST /users/signup
router.post("/signup", validationMiddleware, userService.userSignupService);

// • URL: POST / users / login
router.post("/login", userService.userLoginService);

// • URL: PATCH /users
router.patch(
  "/",
  authorizationMiddleware,
  validationMiddleware,
  userService.updateSingleUserService,
);

// • URL: DELETE /users
router.delete("/", authorizationMiddleware, userService.deleteSingleUserByTokenService);

// • URL: GET / users
router.get("/", authorizationMiddleware, userService.getSingleUserProfileService);

export default router;
