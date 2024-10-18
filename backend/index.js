const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Gameroutes = require('./routes/Gameroute'); 

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/tablednd').then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.log('Connection to MongoDB failed:', error.message);
});

app.use(express.json());
app.use(cors());

app.use('/api', Gameroutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
