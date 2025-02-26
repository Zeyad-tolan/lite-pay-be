import cookieParser from "cookie-parser";
import fireDbConnection from "./db/dbConnection.js";
import dbRouter from "./versions/db.router.js";
import v1Router from "./versions/v1.router.js";
import cors from "cors";
import env from "dotenv";
import passport from "passport";
env.config();

const bootstrap = (app) => {
  // Middlewares
  app.use(cors());
  app.use(cookieParser());
  app.use(passport.initialize());

  // Routes
  app.use("/db", dbRouter);
  app.use("/api/v1", v1Router);

  // Global Error Handler
  app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ message: err.message || "Something went wrong" });
  });

  fireDbConnection()
    .then(() => {
      console.log("Database connected successfully");
    })
    .catch((err) => {
      console.error("Database connection failed:", err.message || err);
      process.exit(1);
    });
};

export default bootstrap;
