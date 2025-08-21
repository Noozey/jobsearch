// userRouter.js
import { Router } from "express";
import connectToMongo from "../database/MangoDb.js";
import { ObjectId } from "mongodb";

const userRouter = Router();

userRouter.get("/", async (req, res) => {
  const { id } = req.query;
  try {
    const client = await connectToMongo();
    const db = client.db("Auth");
    const collection = db.collection("register");

    // Find the main user
    const user = await collection.findOne({ _id: new ObjectId(id) });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Extract follower ids and validate them
    const followerIds = Object.keys(user.followerList || {});
    const validFollowerIds = followerIds.filter((fid) => {
      try {
        return ObjectId.isValid(fid) && fid.length === 24;
      } catch (err) {
        console.error("Invalid follower ID:", fid);
        return false;
      }
    });

    // Fetch followers data
    let followersData = [];
    if (validFollowerIds.length > 0) {
      followersData = await collection
        .find({
          _id: { $in: validFollowerIds.map((fid) => new ObjectId(fid)) },
        })
        .toArray();
    }

    // Extract following ids and get following data
    const followingIds = Object.keys(user.followingList || {});
    const validFollowingIds = followingIds.filter((fid) => {
      try {
        return ObjectId.isValid(fid) && fid.length === 24;
      } catch (err) {
        console.error("Invalid following ID:", fid);
        return false;
      }
    });

    let followingData = [];
    if (validFollowingIds.length > 0) {
      followingData = await collection
        .find({
          _id: { $in: validFollowingIds.map((fid) => new ObjectId(fid)) },
        })
        .toArray();
    }

    // Extract apply ids and get applicants data
    const applyIds = Object.keys(user.apply || {});
    const validApplyIds = applyIds.filter((aid) => {
      try {
        return ObjectId.isValid(aid) && aid.length === 24;
      } catch (err) {
        console.error("Invalid apply ID:", aid);
        return false;
      }
    });

    let applyData = [];
    if (validApplyIds.length > 0) {
      applyData = await collection
        .find({
          _id: { $in: validApplyIds.map((aid) => new ObjectId(aid)) },
        })
        .toArray();
    }

    res.json({
      ...user,
      followersData,
      followingData,
      applyData,
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

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

userRouter.post("/follow", async (req, res) => {
  const { sendReqId, userId } = req.body;
  try {
    const client = await connectToMongo();
    const db = client.db("Auth");
    const collection = db.collection("register");

    // 1. Add userId into sendReqId's followerList
    await collection.updateOne(
      { _id: new ObjectId(sendReqId) },
      { $set: { [`followerList.${userId}`]: true } },
    );

    // 2. Add sendReqId into userId's followingList
    await collection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { [`followingList.${sendReqId}`]: true } },
    );

    res.json({ message: "Follow request sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

userRouter.post("/apply", async (req, res) => {
  const { sendReqId, userId } = req.body;

  try {
    const client = await connectToMongo();
    const db = client.db("Auth");
    const collection = db.collection("register");

    const result = await collection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { [`apply.${sendReqId}`]: true } },
    );

    res.json("Apply Sended");
  } catch (err) {
    console.log(err);
  }
});

userRouter.post("/accept-application", async (req, res) => {
  const { userId, applicantId } = req.body;

  try {
    const client = await connectToMongo();
    const db = client.db("Auth");
    const collection = db.collection("register");

    // Validate ObjectIds
    if (!ObjectId.isValid(userId) || !ObjectId.isValid(applicantId)) {
      return res.status(400).json({ error: "Invalid user IDs" });
    }

    // Start a session for transaction
    const session = client.startSession();

    try {
      await session.withTransaction(async () => {
        // Remove from apply list and add to follower list
        await collection.updateOne(
          { _id: new ObjectId(userId) },
          {
            $unset: { [`apply.${applicantId}`]: "" },
            $set: { [`followerList.${applicantId}`]: true },
          },
          { session },
        );

        // Add the user to applicant's following list
        await collection.updateOne(
          { _id: new ObjectId(applicantId) },
          {
            $set: { [`followingList.${userId}`]: true },
          },
          { session },
        );

        // No need to update static counts - we use dynamic counts now
      });

      res.json({ message: "Application accepted successfully" });
    } finally {
      await session.endSession();
    }
  } catch (err) {
    console.error("Error accepting application:", err);
    res.status(500).json({ error: "Server error occurred" });
  }
});

// Reject application route
userRouter.post("/reject-application", async (req, res) => {
  const { userId, applicantId } = req.body;

  try {
    const client = await connectToMongo();
    const db = client.db("Auth");
    const collection = db.collection("register");

    // Validate ObjectIds
    if (!ObjectId.isValid(userId) || !ObjectId.isValid(applicantId)) {
      return res.status(400).json({ error: "Invalid user IDs" });
    }

    // Remove from apply list
    const result = await collection.updateOne(
      { _id: new ObjectId(userId) },
      { $unset: { [`apply.${applicantId}`]: "" } },
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "Application rejected successfully" });
  } catch (err) {
    console.error("Error rejecting application:", err);
    res.status(500).json({ error: "Server error occurred" });
  }
});

export { userRouter };
