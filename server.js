const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Message Schema
const messageSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  createdAt: { type: Date, default: Date.now },
});
const Message = mongoose.model('Message', messageSchema);

// POST route — saves message to DB
app.post('/api/contact', async (req, res) => {
  try {
    const newMessage = new Message(req.body);
    await newMessage.save();
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save message' });
  }
});
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// GET route — lets you view all messages
app.get('/api/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});