
/**
 * Simple Cat Lovers app: Node (Express) API + static React frontend
 * Run: npm install && npm start
 */
const express = require('express');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Serve static files (frontend)
app.use(express.static(path.join(__dirname, 'public')));

// --- In-memory "database" ---
const users = [
  { username: 'catlover', password: 'meow123', displayName: 'Cat Lover' },
  { username: 'whiskers', password: 'purr789', displayName: 'Mr. Whiskers' },
];

// token -> username
const sessions = new Map();

// imageUrl -> [{ user, text, ts }]
const commentsByImage = new Map();

function authMiddleware(req, res, next) {
  const auth = req.headers['authorization'] || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token || !sessions.has(token)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  req.user = sessions.get(token);
  next();
}

// --- API ---

// Login: returns a token
app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {};
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }
  const token = crypto.randomBytes(16).toString('hex');
  sessions.set(token, { username: user.username, displayName: user.displayName });
  res.json({ token, user: { username: user.username, displayName: user.displayName } });
});

// Get comments for a particular image URL
app.get('/api/comments', (req, res) => {
  const imageUrl = req.query.imageUrl;
  if (!imageUrl) return res.status(400).json({ error: 'imageUrl is required' });
  const list = commentsByImage.get(imageUrl) || [];
  res.json({ comments: list });
});

// Post a comment (auth required)
app.post('/api/comments', authMiddleware, (req, res) => {
  const { imageUrl, text } = req.body || {};
  if (!imageUrl || !text) return res.status(400).json({ error: 'imageUrl and text are required' });
  const entry = { user: req.user.displayName || req.user.username, text, ts: new Date().toISOString() };
  const list = commentsByImage.get(imageUrl) || [];
  list.push(entry);
  commentsByImage.set(imageUrl, list);
  res.status(201).json({ ok: true, comment: entry });
});

// Logout (optional)
app.post('/api/logout', authMiddleware, (req, res) => {
  const auth = req.headers['authorization'] || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (token) sessions.delete(token);
  res.json({ ok: true });
});

// Fallback to index.html for any unknown route (SPA-style)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Cat Lovers app running on http://localhost:${PORT}`);
});
