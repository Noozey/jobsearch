import { Router } from "express";
import connectToMongo from "../database/MangoDb.js";

const jobRouter = Router();

jobRouter.post("/create", async (req, res) => {
  const { postData, user } = req.body;
  console.log(postData, user);

  try{
    const client = await connectToMongo()
    const db = client.db("Auth")

  }
});

jobRouter.get("/jobdetail", async (req, res) => {
  try {
    const client = await connectToMongo(); // connect safely only once
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
  }
});

export { jobRouter };
