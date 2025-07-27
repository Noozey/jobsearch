import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import { authRouter } from "./routes/auth.js";
import { userRouter } from "./routes/user.js";
import { jobRouter } from "./routes/job.js";

const app = express();
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.use(express.json());

const PORT = 3000;

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/job", jobRouter);

app.listen(PORT, () => console.log("Server is alive on port.", PORT));
