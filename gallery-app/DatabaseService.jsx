import * as SQLite from 'expo-sqlite';

// Correct database opening and initialization
const openDatabase = () => {
  const db = SQLite.openDatabaseAsync('gallery.db');
  
  if (!db) {
    console.error('Failed to open database');
    return null;
  }
  
  return db;
};

// Initialize database tables
const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    const db = openDatabase();
    
    if (!db) {
      reject(new Error('Database could not be opened'));
      return;
    }

    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS images (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          uri TEXT NOT NULL,
          latitude REAL,
          longitude REAL,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
          description TEXT
        )`,
        [],
        () => {
          console.log('Images table created successfully');
          resolve();
        },
        (_, error) => {
          console.error('Error creating images table:', error);
          reject(error);
        }
      );
    }, 
    (error) => {
      console.error('Transaction error:', error);
      reject(error);
    }, 
    () => {
      console.log('Transaction completed');
    });
  });
};

// CRUD Operations
const DatabaseService = {
  // Get database instance for each operation
  getDatabase: () => {
    return SQLite.openDatabase('gallery.db');
  },

  // Add new image
  addImage: (uri, latitude, longitude, description) => {
    return new Promise((resolve, reject) => {
      const db = DatabaseService.getDatabase();
      db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO images (uri, latitude, longitude, description) VALUES (?, ?, ?, ?)',
          [uri, latitude, longitude, description],
          (_, { insertId }) => resolve(insertId),
          (_, error) => reject(error)
        );
      });
    });
  },

  // Get all images
  getAllImages: () => {
    return new Promise((resolve, reject) => {
      const db = DatabaseService.getDatabase();
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM images ORDER BY timestamp DESC',
          [],
          (_, { rows }) => resolve(rows._array),
          (_, error) => reject(error)
        );
      });
    });
  },

  // Delete image by ID
  deleteImage: (id) => {
    return new Promise((resolve, reject) => {
      const db = DatabaseService.getDatabase();
      db.transaction(tx => {
        tx.executeSql(
          'DELETE FROM images WHERE id = ?',
          [id],
          (_, result) => resolve(result),
          (_, error) => reject(error)
        );
      });
    });
  },

  // Search images by location or description
  searchImages: (query) => {
    return new Promise((resolve, reject) => {
      const db = DatabaseService.getDatabase();
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM images WHERE description LIKE ? OR latitude LIKE ? OR longitude LIKE ?',
          [`%${query}%`, `%${query}%`, `%${query}%`],
          (_, { rows }) => resolve(rows._array),
          (_, error) => reject(error)
        );
      });
    });
  }
};

export { initializeDatabase, DatabaseService };