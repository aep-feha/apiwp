const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

let db;

async function initializeDatabase() {
    if (!db) {
        db = await open({
            filename: path.join(__dirname, '..', 'database.sqlite'),
            driver: sqlite3.Database
        });

        await db.exec(`
            CREATE TABLE IF NOT EXISTS forms (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                company TEXT NOT NULL,
                token TEXT,
                created_at TEXT NOT NULL
            )
        `);
    }
}

async function insertForm(formData) {
    try {
        await initializeDatabase();
        if (!formData.name || !formData.email || !formData.company) {
            throw new Error('Name, email, and company are mandatory fields');
        }
        
        // Check if email already exists
        const existingEmail = await db.get('SELECT email FROM forms WHERE email = ?', formData.email);
        if (existingEmail) {
            // throw new Error('Email already exists');
        }
        
        const createdAt = new Date().toISOString();
        const result = await db.run(
            'INSERT INTO forms (name, email, company, token, created_at) VALUES (?, ?, ?, ?, ?)',
            [formData.name, formData.email, formData.company, formData.token, createdAt]
        );
        return result.lastID;
    } catch (error) {
        console.error('Error inserting form data:', error);
        throw error;
    }
}

async function getAllForms() {
    try {
        await initializeDatabase();
        const forms = await db.all('SELECT * FROM forms');
        return forms;
    } catch (error) {
        console.error('Error fetching all forms:', error);
        throw error;
    }
}

async function deleteForm(id) {
    try {
        await initializeDatabase();
        const result = await db.run('DELETE FROM forms WHERE id = ?', id);
        if (result.changes === 0) {
            throw new Error('Form not found');
        }
        return result.changes;
    } catch (error) {
        console.error('Error deleting form:', error);
        throw error;
    }
}

module.exports = {
    insertForm, getAllForms, deleteForm
};
