const express = require('express');
const { sendEmail } = require('./services/mail');
const { generateToken, verifyToken } = require('./services/generator');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/submit', async (req, res) => {
    const { email, name, company, message } = req.body;
    if (!email || !name || !company) {
        return res.status(400).json({ error: 'Email, name, and company are required' });
    }

    try {
        const { insertForm } = require('./services/database');
        await insertForm({ name, email, company, message });

        const token = generateToken({ email });
        sendEmail(token, email);

        res.json({ message: 'Form data saved and email sent successfully' });
    } catch (error) {
        console.error('Error processing request:', error);
        if (error.message === 'Email already exists') {
            return res.status(400).json({ error: 'Email already exists' });
        } else if (error.message === 'Name, email, and company are mandatory fields') {
            return res.status(400).json({ error: 'Name, email, and company are mandatory fields' });
        } else {
            return res.status(500).json({ error: 'An error occurred while processing your request' });
        }
    }
});

app.get('/validate', (req, res) => {
    const { token } = req.query;
    if (!token) {
        return res.status(400).json({ error: 'Token is required' });
    }

    try {
        const decoded = verifyToken(token);
        res.json({ valid: true, decoded });
    } catch (error) {
        res.status(400).json({ valid: false, error: error.message });
    }
});


app.get('/forms', async (req, res) => {
    try {
        const { getAllForms } = require('./services/database');
        const forms = await getAllForms();
        res.json(forms);
    } catch (error) {
        console.error('Error fetching forms:', error);
        res.status(500).json({ error: 'An error occurred while fetching forms' });
    }
});


app.get('/', async (req, res) => {
    res.send('Hello World!');
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
