const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

let db = null;

function getDatabasePath() {
  if (process.env.NODE_ENV === 'production') {
    const userDataPath = './data/snippets';
    
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

function backupDatabase(dbPath) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = `${dbPath}.${timestamp}.backup`;
  
  try {
    if (fs.existsSync(dbPath)) {
      fs.copyFileSync(dbPath, backupPath);
      console.log(`Database backed up to: ${backupPath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Failed to create database backup:', error);
    throw error;
  }
}

function needsMigration(db) {
  const hasCodeColumn = db.prepare(`
    SELECT COUNT(*) as count 
    FROM pragma_table_info('snippets') 
    WHERE name = 'code'
  `).get().count > 0;

  return hasCodeColumn;
}

async function migrateToV1_4_0(db) {
  console.log('Starting migration to fragments...');
  
  if (!needsMigration(db)) {
    console.log('Migration already completed');
    return;
  }

  db.pragma('foreign_keys = OFF');
  
  try {
    db.transaction(() => {
      db.exec(`
        CREATE TABLE IF NOT EXISTS fragments (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          snippet_id INTEGER NOT NULL,
          file_name TEXT NOT NULL,
          code TEXT NOT NULL,
          language TEXT NOT NULL,
          position INTEGER NOT NULL,
          FOREIGN KEY (snippet_id) REFERENCES snippets(id) ON DELETE CASCADE
        );

        CREATE INDEX IF NOT EXISTS idx_fragments_snippet_id ON fragments(snippet_id);
      
        CREATE TABLE IF NOT EXISTS shared_snippets (
          id TEXT PRIMARY KEY,
          snippet_id INTEGER NOT NULL,
          requires_auth BOOLEAN NOT NULL DEFAULT false,
          expires_at DATETIME,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (snippet_id) REFERENCES snippets(id) ON DELETE CASCADE
        );
      
        CREATE INDEX IF NOT EXISTS idx_shared_snippets_snippet_id ON shared_snippets(snippet_id);
      `);

      const snippets = db.prepare('SELECT id, code, language FROM snippets').all();
      const insertFragment = db.prepare(
        'INSERT INTO fragments (snippet_id, file_name, code, language, position) VALUES (?, ?, ?, ?, ?)'
      );

      for (const snippet of snippets) {
        insertFragment.run(snippet.id, 'main', snippet.code || '', snippet.language || 'plaintext', 0);
      }

      db.exec(`
        CREATE TABLE snippets_new (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          description TEXT,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        INSERT INTO snippets_new (id, title, description, updated_at)
        SELECT id, title, description, updated_at FROM snippets;

        DROP TABLE snippets;
        ALTER TABLE snippets_new RENAME TO snippets;
      `);
    })();

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    db.pragma('foreign_keys = ON');
  }
}

function createInitialSchema(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS snippets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      snippet_id INTEGER,
      name TEXT NOT NULL,
      FOREIGN KEY (snippet_id) REFERENCES snippets(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS fragments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      snippet_id INTEGER NOT NULL,
      file_name TEXT NOT NULL,
      code TEXT NOT NULL,
      language TEXT NOT NULL,
      position INTEGER NOT NULL,
      FOREIGN KEY (snippet_id) REFERENCES snippets(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_categories_snippet_id ON categories(snippet_id);
    CREATE INDEX IF NOT EXISTS idx_fragments_snippet_id ON fragments(snippet_id);

    CREATE TABLE IF NOT EXISTS shared_snippets (
      id TEXT PRIMARY KEY,
      snippet_id INTEGER NOT NULL,
      requires_auth BOOLEAN NOT NULL DEFAULT false,
      expires_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (snippet_id) REFERENCES snippets(id) ON DELETE CASCADE
    );
  
    CREATE INDEX IF NOT EXISTS idx_shared_snippets_snippet_id ON shared_snippets(snippet_id);
  `);
}

function initializeDatabase() {
  try {
    const dbPath = getDatabasePath();
    console.log(`Initializing SQLite database at: ${dbPath}`);

    const dbExists = fs.existsSync(dbPath);
    
    db = new Database(dbPath, { 
      verbose: console.log,
      fileMustExist: false
    });

    db.pragma('foreign_keys = ON');
    db.pragma('journal_mode = WAL');

    if (!dbExists) {
      console.log('Creating new database with initial schema...');
      createInitialSchema(db);
    } else {
      console.log('Database file exists, checking for needed migrations...');
      
      if (needsMigration(db)) {
        console.log('Database needs migration, creating backup...');
        if (backupDatabase(dbPath)) {
          console.log('Starting migration process...');
          migrateToV1_4_0(db);
        }
      } else {
        console.log('Database schema is up to date');
      }
    }

    console.log('Database initialization completed successfully');
    return db;
  } catch (error) {
    console.error('Database initialization error:', error);
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
  migrateToV1_4_0,
  getDb
};