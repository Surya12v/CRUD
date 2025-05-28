const express = require('express');
const router = express.Router();
const FormBuilder = require('../models/FormBuilderSchema');

router.post('/', async (req, res) => {
  try {
    if (!req.body || !req.body.collectionName || !req.body.schema) {
      return res.status(400).json({ message: 'Invalid request body' });
    }
    
    // Check if collection already exists
    const existing = await FormBuilder.findOne({ 
      collectionName: req.body.collectionName 
    });
    if (existing) {
      return res.status(400).json({ 
        message: 'Collection name already exists' 
      });
    }

    const formConfig = new FormBuilder(req.body);
    await formConfig.save();
    res.status(201).json(formConfig);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/:collectionName', async (req, res) => {
  try {
    const config = await FormBuilder.findOne({ 
      collectionName: req.params.collectionName 
    });
    if (!config) {
      return res.status(404).json({ message: 'Form configuration not found' });
    }
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all form configurations
router.get('/', async (req, res) => {
  try {
    const configs = await FormBuilder.find();
    res.json(configs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add delete endpoint
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await FormBuilder.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Configuration not found' });
    }
    res.json({ message: 'Configuration deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add update endpoint
router.put('/:id', async (req, res) => {
  try {
    if (!req.body || !req.body.collectionName || !req.body.schema) {
      return res.status(400).json({ message: 'Invalid request body' });
    }

    const updated = await FormBuilder.findByIdAndUpdate(
      req.params.id, 
      req.body,
      { new: true }
    );
    
    if (!updated) {
      return res.status(404).json({ message: 'Form configuration not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
