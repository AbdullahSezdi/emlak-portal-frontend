const express = require('express');
const Property = require('../models/Property');
const router = express.Router();

// Get all properties
router.get('/properties', async (req, res) => {
    try {
        const properties = await Property.findAll();
        res.json(properties);
    } catch (error) {
        console.error('Error fetching properties:', error);
        res.status(500).json({ message: 'Error fetching properties' });
    }
});

// Get single property
router.get('/properties/:id', async (req, res) => {
    try {
        const property = await Property.findByPk(req.params.id);
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }
        res.json(property);
    } catch (error) {
        console.error('Error fetching property:', error);
        res.status(500).json({ message: 'Error fetching property' });
    }
});

// Create property
router.post('/properties', async (req, res) => {
    try {
        const property = await Property.create(req.body);
        res.status(201).json(property);
    } catch (error) {
        console.error('Error creating property:', error);
        res.status(500).json({ message: 'Error creating property' });
    }
});

// Update property
router.put('/properties/:id', async (req, res) => {
    try {
        const property = await Property.findByPk(req.params.id);
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }
        await property.update(req.body);
        res.json(property);
    } catch (error) {
        console.error('Error updating property:', error);
        res.status(500).json({ message: 'Error updating property' });
    }
});

// Delete property
router.delete('/properties/:id', async (req, res) => {
    try {
        const property = await Property.findByPk(req.params.id);
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }
        await property.destroy();
        res.json({ message: 'Property deleted successfully' });
    } catch (error) {
        console.error('Error deleting property:', error);
        res.status(500).json({ message: 'Error deleting property' });
    }
});

module.exports = router; 