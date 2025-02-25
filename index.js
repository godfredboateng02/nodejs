require("dotenv").config();
const express = require("express");
const pool = require("./db");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 📌 API per ottenere tutti i TODO
app.get("/api/todos", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM todos ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Errore del server" });
  }
});

// 📌 API per aggiungere un TODO
app.post("/api/todos", async (req, res) => {
  try {
    const { text } = req.body;
    const result = await pool.query("INSERT INTO todos (text) VALUES ($1) RETURNING *", [text]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Errore nell'aggiunta" });
  }
});

// 📌 API per eliminare un TODO
app.delete("/api/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM todos WHERE id = $1 RETURNING *", [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "TODO non trovato" });
    res.json({ message: "TODO eliminato con successo" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Errore nella rimozione" });
  }
});

// Avvia il server
app.listen(PORT, () => {
  console.log(`Server in ascolto su http://localhost:${PORT}`);
});
