const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');
const fs = require('fs');

let db = null;

function getDatabasePath() {
  if (process.env.NODE_ENV === 'production') {
    const userDataPath = process.env.ELECTRON_START_URL
      ? path.join(process.env.APPDATA || process.env.HOME || process.env.USERPROFILE, 'ByteStash')
      : './data/snippets';
    
    if (!fs.existsSync(userDataPath)) {
      fs.mkdirSync(userDataPath, { recursive: true });
    }
    
    return path.join(userDataPath, 'snippets.db');
  } else {
    const devPath = path.join(__dirname, '../../../data/snippets');
    if (!fs.existsSync(devPath)) {
      fs.mkdirSync(devPath, { recursive: true });
    }
    return path.join(devPath, 'snippets.db');
  }
}

async function initializeDatabase() {
  try {
    const dbPath = getDatabasePath();
    console.log(`Initializing SQLite database at: ${dbPath}`);

    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    // Enable foreign keys
    await db.run('PRAGMA foreign_keys = ON');

    // Create snippets table with timestamp
    await db.exec(`
      CREATE TABLE IF NOT EXISTS snippets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        language TEXT NOT NULL,
        description TEXT,
        code TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Database initialized successfully');
    return db;
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

async function createBackup() {
  try {
    const dbPath = getDatabasePath();
    const backupPath = getBackupPath();
    
    // Check if source database exists
    if (!fs.existsSync(dbPath)) {
      throw new Error('Source database does not exist');
    }

    // Create backup using stream to handle large files
    await new Promise((resolve, reject) => {
      const readStream = fs.createReadStream(dbPath);
      const writeStream = fs.createWriteStream(backupPath);
      
      readStream.on('error', reject);
      writeStream.on('error', reject);
      writeStream.on('finish', resolve);
      
      readStream.pipe(writeStream);
    });

    // Verify backup file exists and has content
    const backupStats = fs.statSync(backupPath);
    if (backupStats.size === 0) {
      throw new Error('Backup file was created but is empty');
    }

    console.log(`Database backup created successfully at: ${backupPath}`);
    return backupPath;
  } catch (error) {
    console.error('Database backup error:', error);
    throw error;
  }
}

function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return db;
}

module.exports = {
  initializeDatabase,
  getDb
};