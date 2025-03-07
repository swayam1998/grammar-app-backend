const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const grammarRoutes = require('./routes/grammar');

const app = express();
const PORT = 5001;

app.use(cors());
app.use(bodyParser.json());

app.use('/api', authRoutes);
app.use('/api', grammarRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});