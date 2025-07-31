// userRouter.js
import { Router } from "express";
import connectToMongo from "../database/MangoDb.js";

const userRouter = Router();

userRouter.get("/data", async (req, res) => {
  try {
    const client = await connectToMongo();
    const db = client.db("Auth");
    const collection = db.collection("register");

    const users = await collection.find().toArray();

    res.status(200).json({ users });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export { userRouter };
