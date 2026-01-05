const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const authenticateUser = require('./middleware/auth'); 
require('dotenv').config();

const pinsRouter = require('./routes/pins');

const app = express();
const prisma = new PrismaClient();

const path = require('path'); 


app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/api/pins', pinsRouter);


app.use(cors());
app.use(express.json());

app.get('/api/config', (req, res) => {
  res.json({
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY
  });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
