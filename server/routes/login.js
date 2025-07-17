import { Router } from "express";
import client from "../database/MangoDb.js";

const router = Router();

router.post("/", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    await client.connect();
    const db = client.db("Auth");
    const collection = db.collection("register");

    const user = await collection.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid password" });
    }

    res.status(200).json({
      message: "Login successful",
      userId: user._id,
      name: user.name,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    await client.close();
  }
});

export default router;
