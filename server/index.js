import express from "express";
import register from "./routes/register.js";
import login from "./routes/login.js";
import cors from "cors";

const app = express();
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

const PORT = 3000;

app.get("/", (req, res) => {
  res.json({ hello: "hello" });
});

app.use("/register", register);
app.use("/login", login);
app.listen(PORT, () => console.log("Server is alive on port.", PORT));
