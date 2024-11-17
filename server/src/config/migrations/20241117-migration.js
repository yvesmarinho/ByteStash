const bcrypt = require('bcrypt');

function needsMigration(db) {
  try {
    const hasUsersTable = db.prepare(`
      SELECT name 
      FROM sqlite_master 
      WHERE type='table' AND name='users'
    `).get();

    if (!hasUsersTable) {
      console.log('Users table does not exist, migration needed');
      return true;
    }

    const hasUserIdColumn = db.prepare(`
      SELECT COUNT(*) as count 
      FROM pragma_table_info('snippets') 
      WHERE name = 'user_id'
    `).get();

    if (hasUserIdColumn.count === 0) {
      console.log('Snippets table missing user_id column, migration needed');
      return true;
    }

    const hasUserIdIndex = db.prepare(`
      SELECT COUNT(*) as count 
      FROM sqlite_master 
      WHERE type='index' AND name='idx_snippets_user_id'
    `).get();

    if (hasUserIdIndex.count === 0) {
      console.log('Missing user_id index, migration needed');
      return true;
    }

    const orphanedSnippets = db.prepare(`
      SELECT COUNT(*) as count 
      FROM snippets 
      WHERE user_id IS NULL
    `).get();

    if (orphanedSnippets.count > 0) {
      console.log(`Found ${orphanedSnippets.count} snippets without user_id, migration needed`);
      return true;
    }

    console.log('Database schema is up to date, no migration needed');
    return false;
  } catch (error) {
    console.error('Error checking migration status:', error);
    throw error;
  }
}

async function up_v1_5_0(db) {
  if (!needsMigration(db)) {
    console.log('v1.5.0 - Migration is not needed, database is up to date');
    return;
  }
  
  console.log('v1.5.0 - Starting migration: Adding users table and updating snippets...');

  try {
    db.exec(`
      CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX idx_users_username ON users(username);
    `);

    db.exec(`
      ALTER TABLE snippets ADD COLUMN user_id INTEGER REFERENCES users(id);
      CREATE INDEX idx_snippets_user_id ON snippets(user_id);
    `);

    const adminUsername = process.env.DEFAULT_ADMIN_USERNAME;
    const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD;

    if (adminUsername && adminPassword) {
      console.log('Creating default admin user...');
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(adminPassword, saltRounds);

      const insertUser = db.prepare(`
        INSERT INTO users (username, password_hash)
        VALUES (?, ?)
      `);

      const result = insertUser.run(adminUsername, passwordHash);
      const userId = result.lastInsertRowid;

      const updateSnippets = db.prepare(`
        UPDATE snippets SET user_id = ? WHERE user_id IS NULL
      `);

      updateSnippets.run(userId);
      console.log('Migrated existing snippets to admin user');
    } else {
      console.log('No default admin credentials provided, skipping user creation');
    }

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

module.exports = {
  up_v1_5_0
};