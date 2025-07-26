import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import client from "../database/MangoDb.js";

dotenv.config();
const authRouter = Router();

authRouter.post("/login", async (req, res) => {
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

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.status(200).json({
      token: token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    await client.close();
  }
});

authRouter.get("/register", async (req, res) => {
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

authRouter.post("/", async (req, res) => {
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

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = {
      name,
      email,
      password: hashedPassword,
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

authRouter.post("/authenticate", (req, res) => {
  const { token } = req.body;
  const verified = jwt.verify(token, secretOrPublicKey, options);
  res.json(verified.payload);
});

export { authRouter };
