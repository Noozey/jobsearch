import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import { authRouter } from "./routes/auth.js";

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

app.get("/", (req, res) => {
  res.json({ hello: "hello" });
});

app.use("/auth", authRouter);

app.listen(PORT, () => console.log("Server is alive on port.", PORT));
