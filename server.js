const express = require("express");
const bodyParser = require("body-parser");
const mariadb = require("mariadb");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "client", "public")));

const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  connectionLimit: 5
});

const validateSquareData = (req, res, next) => {
    const { title, plane, purpose, class: squareClass } = req.body;
    if (!title || !plane || !purpose || !squareClass) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    next();
};

app.post("/squares", validateSquareData, async (req, res) => {
  const { title, plane, purpose, delineator, notations, details, extraData, class: squareClass, parent, depth, name, size, color, type, parent_id } = req.body;
  const query = `INSERT INTO squares (title, plane, purpose, delineator, notations, details, extraData, class, parent, depth, name, size, color, type, parent_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  try {
    const conn = await pool.getConnection();
    const result = await conn.query(query, [title, plane, purpose, delineator, notations, details, extraData, squareClass, parent, depth, name, size, color, type, parent_id]);
    conn.release();
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error('Error creating square:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get("/squares", async (req, res) => {
  const query = "SELECT * FROM squares";
  try {
    const conn = await pool.getConnection();
    const results = await conn.query(query);
    conn.release();
    res.status(200).json(results);
  } catch (err) {
    console.error('Error fetching squares:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get("/squares/:id", async (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM squares WHERE id = ?";
  try {
    const conn = await pool.getConnection();
    const results = await conn.query(query, [id]);
    conn.release();
    if (results.length === 0) {
      return res.status(404).json({ error: "Square not found" });
    }
    res.status(200).json(results[0]);
  } catch (err) {
    console.error('Error fetching square by ID:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put("/squares/:id", validateSquareData, async (req, res) => {
  const { id } = req.params;
  const { title, plane, purpose, delineator, notations, details, extraData, class: squareClass, parent, depth, name, size, color, type, parent_id } = req.body;
  const query = `UPDATE squares SET title = ?, plane = ?, purpose = ?, delineator = ?, notations = ?, details = ?, extraData = ?, class = ?, parent = ?, depth = ?, name = ?, size = ?, color = ?, type = ?, parent_id = ? WHERE id = ?`;
  try {
    const conn = await pool.getConnection();
    await conn.query(query, [title, plane, purpose, delineator, notations, details, extraData, squareClass, parent, depth, name, size, color, type, parent_id, id]);
    conn.release();
    res.status(200).json({ message: "Square updated successfully" });
  } catch (err) {
    console.error('Error updating square:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete("/squares/:id", async (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM squares WHERE id = ?";
  try {
    const conn = await pool.getConnection();
    await conn.query(query, [id]);
    conn.release();
    res.status(200).json({ message: "Square deleted successfully" });
  } catch (err) {
    console.error('Error deleting square:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get("/scaled_view.html", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "public", "scaled_view.html"));
});

app.get("/scoped_view.html", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "public", "scoped_view.html"));
});

app.get("/form_page.html", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "public", "form_page.html"));
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "public", "index.html"));
});

app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
