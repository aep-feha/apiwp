const express = require('express');
const bodyParser = require('body-parser');
const { sendEmail } = require('./services/mail');
const { generateToken, verifyToken } = require('./services/generator');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/send-email', async (req, res) => {
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
        res.status(500).json({ error: 'An error occurred while processing your request' });
    }
});

app.post('/verify-token', (req, res) => {
    const { token } = req.body;
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

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
