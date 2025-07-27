import { Router } from "express";
import client from "../database/MangoDb.js";

const jobRouter = Router();

jobRouter.post("/create", async (req, res) => {});

jobRouter.get("/jobdetail", async (req, res) => {
  try {
    await client.connect();
    const db = client.db("Auth");
    const collection = db.collection("jobdata");

    const { query } = req.query;

    let filter = {};

    if (query) {
      const words = query.toString().split(" ").filter(Boolean);

      filter = {
        $or: words.flatMap((word) => [
          { author: { $regex: word, $options: "i" } },
          { username: { $regex: word, $options: "i" } },
          { content: { $regex: word, $options: "i" } },
        ]),
      };
    }

    const jobdetail = await collection.find(filter).toArray();

    res.status(200).json({ jobdetail });
  } catch (error) {
    console.error("Error fetching job details:", error);
    res.status(500).json({ error: "Server error" });
  } finally {
    await client.close();
  }
});

export { jobRouter };
