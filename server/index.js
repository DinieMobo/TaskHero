import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import { errorHandler, routeNotFound } from "./middleware/errorMiddleware.js";
import routes from "./routes/index.js";
import userRoute from "./routes/userRoute.js";
import dbConnection from "./utils/connectDB.js";
dotenv.config();
dbConnection();

const port = process.env.PORT || 8800;
const app = express();

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.CLIENT_URL
        : "http://localhost:3000", "https://taskhero-two.vercel.app" 
    methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api", routes);
app.use('/api/user', userRoute);
app.use(routeNotFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server listening on ${port}`));
