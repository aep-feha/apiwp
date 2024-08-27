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
                email TEXT NOT NULL,
                company TEXT NOT NULL,
                message TEXT
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
        const result = await db.run(
            'INSERT INTO forms (name, email, company, message) VALUES (?, ?, ?, ?)',
            [formData.name, formData.email, formData.company, formData.message]
        );
        return result.lastID;
    } catch (error) {
        console.error('Error inserting form data:', error);
        throw error;
    }
}

module.exports = {
    insertForm
};
