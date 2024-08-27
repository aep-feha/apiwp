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
        const token = generateToken({ email });
        await insertForm({ name, email, company, token });

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
    const { secret } = req.query;

    if (secret !== 'Fehasecret') {
        return res.status(403).json({ error: 'Invalid secret' });
    }

    try {
        const { getAllForms } = require('./services/database');
        const forms = await getAllForms();
        res.json(forms);
    } catch (error) {
        console.error('Error fetching forms:', error);
        res.status(500).json({ error: 'An error occurred while fetching forms' });
    }
});

app.delete('/forms/:id', async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: 'Form ID is required' });
    }

    try {
        const { deleteForm } = require('./services/database');
        await deleteForm(id);
        res.json({ message: 'Form deleted successfully' });
    } catch (error) {
        console.error('Error deleting form:', error);
        if (error.message === 'Form not found') {
            return res.status(404).json({ error: 'Form not found' });
        } else {
            return res.status(500).json({ error: 'An error occurred while deleting the form' });
        }
    }
});



app.get('/', async (req, res) => {
    res.send('Hello World!');
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
