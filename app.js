require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Transaction = require('./models/Transaction');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database connected successfully'))
    .catch(err => console.error(err));

// Routes
app.get('/', async (req, res) => {
    try {
        const transactions = await Transaction.find().sort({ date: -1 });
        res.render('home', { transactions });
    } catch (err) {
        res.status(500).send("Error: " + err.message);
    }
});

app.get('/add', (req, res) => {
    res.render('add');
});

app.post('/add', async (req, res) => {
    try {
        const { category, detail, amount } = req.body;
        const transaction = new Transaction({ category, detail, amount });
        await transaction.save();
        res.redirect('/');
    } catch (err) {
        res.status(500).send("Error: " + err.message);
    }
});

app.get('/all-entries', async (req, res) => {
    try {
        const transactions = await Transaction.find().sort({ date: -1 });
        res.render('all-entries', { transactions });
    } catch (err) {
        res.status(500).send("Error: " + err.message);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
