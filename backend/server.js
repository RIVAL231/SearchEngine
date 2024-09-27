const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => { 
    res.send('Hello World');
 });

app.use(express.json());

app.use(cors({
    origin: '*'
}));

const searchRoutes = require('./routes/search');
app.use('/api/search', searchRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});