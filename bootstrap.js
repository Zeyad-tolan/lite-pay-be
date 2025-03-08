import cookieParser from "cookie-parser";
import fireDbConnection, { sequelize, syncDb } from "./db/dbConnection.js";
import dbRouter from "./versions/db.router.js";
import v1Router from "./versions/v1.router.js";
import cors from "cors";
import env from "dotenv";
import passport from "passport";
env.config();

const bootstrap = (app) => {
  const port = process.env.PORT || 10000;

  // Welcoming API
  app.get("/", (req, res) => {
    res.json({
      message: "Welcome to Litepay API",
    });
  });

  app.use(cors());

  // CORS
  // app.use((req, res, next) => {
  //   const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];
  //   const origin = req.headers.referer || req.headers.origin;

  //   if (allowedOrigins.includes(origin)) {
  //     next();
  //   } else {
  //     res.status(403).json({ message: "Forbidden, you are not allowed to access this API" });
  //   }
  // });



  // middlewares
  app.use(cookieParser());
  app.use(passport.initialize());

  // routers
  app.use("/db",dbRouter);
  app.use("/api/v1",v1Router);

  // app global err handler
  app.use((err,req,res,next)=>{
    const statusCode=err.statusCode || 500;
    const message=err.message || "Something went wrong";
    res.status(statusCode).json({message});
  })

  fireDbConnection()
  .then(() => {
    // syncDb({force:true});
    // syncDb({alter:true});
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err.message || err);
    process.exit(1);
  });
};

export default bootstrap;
