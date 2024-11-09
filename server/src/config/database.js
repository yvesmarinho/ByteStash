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

async function migrateToFragments(db) {
  console.log('Starting migration to fragments...');
  
  // Check if code column exists in snippets table
  const hasCodeColumn = db.prepare(`
    SELECT COUNT(*) as count 
    FROM pragma_table_info('snippets') 
    WHERE name = 'code'
  `).get().count > 0;

  if (!hasCodeColumn) {
    console.log('Migration already completed');
    return;
  }

  // Enable foreign keys and start transaction
  db.pragma('foreign_keys = OFF');
  
  try {
    db.transaction(() => {
      // Create fragments table with language column
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
      `);

      // Copy existing code to fragments, using the snippet's language
      const snippets = db.prepare('SELECT id, code, language FROM snippets').all();
      const insertFragment = db.prepare(
        'INSERT INTO fragments (snippet_id, file_name, code, language, position) VALUES (?, ?, ?, ?, ?)'
      );

      for (const snippet of snippets) {
        insertFragment.run(snippet.id, 'main', snippet.code || '', snippet.language || 'plaintext', 0);
      }

      // Remove language and code columns from snippets table
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

function initializeDatabase() {
  try {
    const dbPath = getDatabasePath();
    console.log(`Initializing SQLite database at: ${dbPath}`);

    db = new Database(dbPath, { 
      verbose: console.log,
      fileMustExist: false
    });

    db.pragma('foreign_keys = ON');
    db.pragma('journal_mode = WAL');

    const fragmentsTable = db.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='fragments'
    `).get();

    if (!fragmentsTable) {
      console.log('Fragments table not found, running migration...');
      migrateToFragments(db);
    }

    db.exec(`
      CREATE TABLE IF NOT EXISTS snippets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        language TEXT NOT NULL,
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

    console.log('Database initialized successfully');
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
  migrateToFragments,
  getDb
};