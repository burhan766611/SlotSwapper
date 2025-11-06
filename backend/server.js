import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoute from "./routes/authRoute.js";
import eventRoute from './routes/eventRoute.js'
import swapRoute from './routes/swapRoute.js'
import dotenv from "dotenv";
import ConnectDB from "./config/db.js";

dotenv.config();
ConnectDB();

const app = express();
const port = 3000;
const frontendUrl = process.env.FRONTEND_URL;
console.log(frontendUrl);

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: frontendUrl,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use("/auth", authRoute);
app.use("/api", eventRoute);
app.use("/swap", swapRoute)

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
