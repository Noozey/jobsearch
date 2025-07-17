import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import e from "express";

dotenv.config(); // Load variables from .env file

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Missing MONGODB_URI in environment variables");
}

const client = new MongoClient(uri);

export default client;
