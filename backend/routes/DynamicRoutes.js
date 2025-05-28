const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

router.post("/:collection", async (req, res) => {
  try {
    const collection = mongoose.connection.collection(req.params.collection);
    const result = await collection.insertOne(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/:collection", async (req, res) => {
  try {
    const collection = mongoose.connection.collection(req.params.collection);
    const data = await collection.find({}).toArray();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
