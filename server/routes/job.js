import { Router } from "express";
import connectToMongo from "../database/MangoDb.js";

const jobRouter = Router();

jobRouter.post("/create", async (req, res) => {
  const { postData, user, jobType } = req.body;
  console.log(postData, user);

  try {
    const client = await connectToMongo();
    const db = client.db("Auth");
    const collection = db.collection("jobdata");

    const data = {
      content: postData,
      author: user.name,
      avatar: user.avatar,
      username: user.name,
      jobType,
    };
    await collection.insertOne(data);
  } catch (err) {
    console.log(err);
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
          { jobType: { $regex: word, $options: "i" } },
          { content: { $regex: word, $options: "i" } },
        ]),
      };
    }

    const jobdetail = await collection.find(filter).sort({ _id: -1 }).toArray();

    res.status(200).json({ jobdetail });
  } catch (error) {
    console.error("Error fetching job details:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export { jobRouter };
