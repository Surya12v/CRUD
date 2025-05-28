const mongoose = require('mongoose');

const formBuilderSchema = new mongoose.Schema({
  collectionName: {
    type: String,
    required: true,
    unique: true
  },
  schema: [{
    field: { type: String, required: true },
    type: { type: String, required: true },
    label: { type: String, required: true },
    required: { type: Boolean, default: false },
    options: [String]
  }]
}, { timestamps: true });

module.exports = mongoose.model('FormBuilder', formBuilderSchema);
