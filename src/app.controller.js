import "../src/configs/env.config.js";
import { connectToDatabase } from "./db/db_connection.js";
import { authorizationMiddleware } from "./middlewares/auth.middleware.js";
import { userRouter, noteRouter } from "./modules/index.modules.js";

export const bootstrap = async (app, express) => {
  app.use(express.json());

  await connectToDatabase();

  app.use("/api/v1/users", userRouter);
  app.use("/api/v1/notes", authorizationMiddleware, noteRouter);

  app.use("/api/v1", (_, response) =>
    response.status(200).json({
      status: "success",
      message: "Welcome to the API!",
    }),
  );

  app.all("/*dummy", (_, response) =>
    response.status(404).json({
      status: "error",
      message: "Route Handler Not Found!!",
    }),
  );
};
