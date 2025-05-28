const mongoose = require('mongoose');

const defaultSchema = {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
};

const getModel = (collectionName, customSchema = null, options = {}) => {
    try {
        // Check if model already exists
        if (mongoose.models[collectionName]) {
            console.log(`Model for ${collectionName} already exists, returning existing model.`);
            return mongoose.models[collectionName];
        }

        const schemaDefinition = customSchema || defaultSchema;
        
        const schemaOptions = {
            timestamps: true,
            id: false, // Disable virtual id
            toJSON: { virtuals: false }, // Disable virtuals in JSON
            toObject: { virtuals: false }, // Disable virtuals in Objects
            ...options
        };

        const schema = new mongoose.Schema(schemaDefinition, schemaOptions);
        console.log("Schema", schema)
        return mongoose.model(collectionName, schema);
    } catch (error) {
        console.error(`Error creating model for ${collectionName}:`, error);
        throw error;
    }
};

module.exports = getModel;
