require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

app.get('/', (req, res) => {
  res.send('Ridepooling backend is running!');
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/rides', require('./routes/rides'));

// Express 5 forwards errors from async handlers here automatically
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Something went wrong on the server' });
});

app.listen(port, () => {
  console.log(`Ridepooling backend listening on port: ${port}`);
});
