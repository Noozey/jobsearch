import { Router } from "express";
import client from "../database/MangoDb.js";

const userRouter = Router();

userRouter.get("/", async (req, res) => {
  try {
    await client.connect();
    const db = client.db("Auth");
    const collection = db.collection("register");

    const users = await collection.find().toArray();

    res.status(200).json({
      message: "Users fetched successfully",
      users: users,
    });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    await client.close();
  }
});

export { userRouter };
