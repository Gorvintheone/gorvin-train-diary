import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
const JWT_SECRET = 'gorvin_ws_super_secret_key_2026';

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./gorvin_diary.db', (err) => {
  if (err) console.error('Adatbázis hiba:', err.message);
  else console.log('Adatbázis csatlakozva.');
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT CHECK(role IN ('trainer', 'client')) NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS invite_codes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,
    used INTEGER DEFAULT 0
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS workouts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    notes TEXT,
    status TEXT DEFAULT 'pending',
    rating INTEGER DEFAULT 0,
    client_log TEXT,
    UNIQUE(client_id, date)
  )`);

  db.get("SELECT * FROM users WHERE email = ?", ['G'], async (err, row) => {
    if (!row) {
      const hash = await bcrypt.hash('123', 10);
      db.run("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)", 
        ['Gorvin WS', 'G', hash, 'trainer']);
    }
  });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err || !user) return res.status(400).json({ error: 'Hibás email vagy jelszó!' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: 'Hibás email vagy jelszó!' });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  });
});

app.post('/api/register', async (req, res) => {
  const { name, email, password, inviteCode } = req.body;
  db.get('SELECT * FROM invite_codes WHERE code = ? AND used = 0', [inviteCode], async (err, invite) => {
    if (err || !invite) return res.status(400).json({ error: 'Érvénytelen vagy már felhasznált meghívókód!' });
    const hash = await bcrypt.hash(password, 10);
    db.run('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', 
      [name, email, hash, 'client'], function(err) {
        if (err) return res.status(400).json({ error: 'Ez az email már regisztrálva van!' });
        db.run('UPDATE invite_codes SET used = 1 WHERE id = ?', [invite.id]);
        res.json({ message: 'Sikeres regisztráció!' });
      });
  });
});

app.get('/api/clients', (req, res) => {
  db.all("SELECT id, name, email FROM users WHERE role = 'client'", [], (err, rows) => {
    res.json(rows || []);
  });
});

app.post('/api/invite', (req, res) => {
  const code = 'GORVIN-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  db.run('INSERT INTO invite_codes (code) VALUES (?)', [code], (err) => {
    if (err) return res.status(500).json({ error: 'Hiba a kód generálásakor' });
    res.json({ code });
  });
});

app.get('/api/workouts', (req, res) => {
  const { clientId, date } = req.query;
  if (!clientId || !date) return res.json({});
  db.get('SELECT * FROM workouts WHERE client_id = ? AND date = ?', [clientId, date], (err, row) => {
    res.json(row || {});
  });
});

app.post('/api/workouts/plan', (req, res) => {
  const { clientId, date, notes } = req.body;
  db.run(`INSERT INTO workouts (client_id, date, notes) VALUES (?, ?, ?)
          ON CONFLICT(client_id, date) DO UPDATE SET notes = excluded.notes`,
    [clientId, date, notes], (err) => {
      if (err) return res.status(500).json({ error: 'Hiba a mentéskor' });
      res.json({ success: true });
    });
});

app.post('/api/workouts/log', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Nincs token' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { date, status, rating, clientLog } = req.body;
    db.run(`UPDATE workouts SET status = ?, rating = ?, client_log = ? WHERE client_id = ? AND date = ?`,
      [status, rating, clientLog, decoded.id, date], (err) => {
        if (err) return res.status(500).json({ error: 'Hiba a mentéskor' });
        res.json({ success: true });
      });
  } catch (err) {
    res.status(401).json({ error: 'Érvénytelen token' });
  }
});

app.listen(5000, () => {
  console.log('Backend fut a http://localhost:5000 porton');
});
