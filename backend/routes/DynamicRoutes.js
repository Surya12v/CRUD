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

// Get single document from dynamic collection
router.get("/:collection/:id", async (req, res) => {
  try {
    const { collection, id } = req.params;
    const db = mongoose.connection.collection(collection);

    const record = await db.findOne({
      _id: new mongoose.Types.ObjectId(id),
    });

    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.json(record);
  } catch (error) {
    console.error("Fetch record error:", error);
    res.status(500).json({ message: error.message });
  }
});

// Delete document from dynamic collection
router.delete("/:collection/:id", async (req, res) => {
  try {
    const { collection, id } = req.params;
    const db = mongoose.connection.collection(collection);

    const result = await db.deleteOne({
      _id: new mongoose.Types.ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.json({ message: "Record deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: error.message });
  }
});

// Add PUT endpoint for updating a document in a dynamic collection
router.put("/:collection/:id", async (req, res) => {
  try {
    const { collection, id } = req.params;
    const db = mongoose.connection.collection(collection);

    // Remove _id if present in body to avoid immutable field error
    const { _id, ...updateData } = req.body;

    const result = await db.updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.json({ message: "Record updated successfully" });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
