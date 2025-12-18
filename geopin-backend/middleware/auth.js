const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// 1. Initialize Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// 2. The Middleware Function
const authenticateUser = async (req, res, next) => {
  // Get the token from the "Authorization" header
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided. Please log in.' });
  }

  // The header usually looks like "Bearer eyJhbGci...", so we split it to get just the token
  const token = authHeader.split(' ')[1];

  // Ask Supabase to verify the token
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return res.status(401).json({ error: 'Invalid token. Access denied.' });
  }

  // If valid, attach the user info to the request so the routes can use it
  req.user = user;
  next(); // specific signal to move to the next step
};

module.exports = authenticateUser;