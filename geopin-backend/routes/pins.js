const express = require('express');
const router = express.Router(); // 
const { PrismaClient } = require('@prisma/client');
const authenticateUser = require('../middleware/auth'); // Go up one folder to find middleware

const prisma = new PrismaClient();

// --- ROUTES (Use 'router' here) ---

// GET /  (This effectively becomes /api/pins)
router.get('/', authenticateUser, async (req, res) => {
  try {
    let user = await prisma.user.findUnique({ where: { email: req.user.email } });
    
    if (!user) {
      user = await prisma.user.create({ data: { email: req.user.email } });
    }

    const pins = await prisma.locationPin.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });

    res.json(pins);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pins' });
  }
});

// POST / (This effectively becomes /api/pins)
router.post('/', authenticateUser, async (req, res) => {
    const { name, latitude, longitude } = req.body;
  
    if (!name || typeof latitude !== 'number' || typeof longitude !== 'number') {
      return res.status(400).json({ error: 'Invalid input.' });
    }
  
    try {
      let user = await prisma.user.findUnique({ where: { email: req.user.email } });
      
      if (!user) {
          user = await prisma.user.create({ data: { email: req.user.email } });
      }
  
      const newPin = await prisma.locationPin.create({
        data: { name, latitude, longitude, userId: user.id }
      });
      res.status(201).json(newPin);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create pin' });
    }
});

// DELETE /:id
router.delete('/:id', authenticateUser, async (req, res) => {
  const pinId = parseInt(req.params.id);
  try {
    const user = await prisma.user.findUnique({ where: { email: req.user.email } });
    
    const deletedPin = await prisma.locationPin.deleteMany({
      where: { id: pinId, userId: user.id }
    });

    if (deletedPin.count === 0) {
      return res.status(404).json({ error: 'Pin not found or unauthorized' });
    }

    res.json({ message: 'Pin deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete pin' });
  }
});

// 3. Export the router so index.js can use it
module.exports = router;