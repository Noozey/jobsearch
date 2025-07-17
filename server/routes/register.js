import { Router } from "express";
import client from "../database/MangoDb.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    await client.connect();
    const db = client.db("Auth");
    const collection = db.collection("register");

    const users = await collection.find().toArray(); // Fetch all users

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

router.post("/", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "Name, email, and password are required" });
  }

  try {
    await client.connect();
    const db = client.db("Auth");
    const collection = db.collection("register");

    const newUser = {
      name,
      email,
      password,
    };

    const result = await collection.insertOne(newUser);

    res.status(201).json({
      message: "User registered successfully",
      userId: result.insertedId,
    });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    await client.close();
  }
});

export default router;
