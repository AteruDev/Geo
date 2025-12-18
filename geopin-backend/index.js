const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const authenticateUser = require('./middleware/auth'); // Import the guard
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();


// ... existing imports
const path = require('path'); // Add this line at the very top

// ... existing app setup

app.use(express.json());
// ADD THIS: Serve files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// ... existing routes

app.use(cors());
app.use(express.json());

// --- ROUTES ---

// 1. GET /api/pins - Retrieve user pins [cite: 37]
// We use 'authenticateUser' here to protect the route
app.get('/api/pins', authenticateUser, async (req, res) => {
  try {
    // Check if the user exists in our MySQL database first
    let user = await prisma.user.findUnique({ where: { email: req.user.email } });

    // If this is their first time, create them in our local DB
    if (!user) {
      user = await prisma.user.create({ data: { email: req.user.email } });
    }

    // Fetch pins ONLY for this specific user [cite: 26]
    const pins = await prisma.locationPin.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });

    res.json(pins);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pins' });
  }
});

// 2. POST /api/pins - Create new pin
app.post('/api/pins', authenticateUser, async (req, res) => {
    const { name, latitude, longitude } = req.body;
  
    // Validation
    if (!name || typeof latitude !== 'number' || typeof longitude !== 'number') {
      return res.status(400).json({ error: 'Invalid input.' });
    }
  
    try {
      // 1. Try to find the user
      let user = await prisma.user.findUnique({ where: { email: req.user.email } });
  
      // 2. IF USER DOES NOT EXIST -> CREATE THEM NOW
      if (!user) {
          console.log("User missing, creating new user:", req.user.email);
          user = await prisma.user.create({ data: { email: req.user.email } });
      }
  
      // 3. Now create the pin linked to that user
      const newPin = await prisma.locationPin.create({
        data: {
          name,
          latitude,
          longitude,
          userId: user.id
        }
      });
      
      console.log("Pin saved successfully:", newPin.id); // Log success
      res.status(201).json(newPin);
  
    } catch (error) {
      console.error("Error saving pin:", error); // Log the actual error to terminal
      res.status(500).json({ error: 'Failed to create pin' });
    }
  });
// 3. DELETE /api/pins/:id - Delete pin [cite: 39]
app.delete('/api/pins/:id', authenticateUser, async (req, res) => {
  const pinId = parseInt(req.params.id);

  try {
    // Verify the pin belongs to the user before deleting [cite: 26]
    const user = await prisma.user.findUnique({ where: { email: req.user.email } });
    
    // Attempt to delete where ID matches AND User matches
    const deletedPin = await prisma.locationPin.deleteMany({
      where: {
        id: pinId,
        userId: user.id // Security check
      }
    });

    if (deletedPin.count === 0) {
      return res.status(404).json({ error: 'Pin not found or unauthorized' });
    }

    res.json({ message: 'Pin deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete pin' });
  }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
