import * as SQLite from 'expo-sqlite';

// Open database
const openDatabase = async () => {
  try {
    const db = await SQLite.openDatabaseAsync('gallery.db');
    return db;
  } catch (error) {
    console.error('Failed to open database:', error);
    return null;
  }
};

// Initialize database tables
const initializeDatabase = async () => {
  try {
    const db = await openDatabase();
    
    if (!db) {
      throw new Error('Database could not be opened');
    }

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uri TEXT NOT NULL,
        latitude REAL,
        longitude REAL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        description TEXT
      )
    `);

    console.log('Images table created successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// CRUD Operations
const DatabaseService = {
  // Get database instance for each operation
  getDatabase: async () => {
    return await SQLite.openDatabaseAsync('gallery.db');
  },

  // Add new image
  addImage: async (uri, latitude, longitude, description) => {
    const db = await DatabaseService.getDatabase();
    
    const result = await db.runAsync(
      'INSERT INTO images (uri, latitude, longitude, description) VALUES (?, ?, ?, ?)',
      [uri, latitude, longitude, description]
    );
    
    return result.lastInsertRowId;
  },

  // Get all images
  getAllImages: async () => {
    const db = await DatabaseService.getDatabase();
    
    const result = await db.getAllAsync(
      'SELECT * FROM images ORDER BY timestamp DESC'
    );
    
    return result;
  },

  // Delete image by ID
  deleteImage: async (id) => {
    const db = await DatabaseService.getDatabase();
    
    const result = await db.runAsync(
      'DELETE FROM images WHERE id = ?',
      [id]
    );
    
    return result;
  },

  // Search images by location or description
  searchImages: async (query) => {
    const db = await DatabaseService.getDatabase();
    
    const result = await db.getAllAsync(
      'SELECT * FROM images WHERE description LIKE ? OR latitude LIKE ? OR longitude LIKE ?',
      [`%${query}%`, `%${query}%`, `%${query}%`]
    );
    
    return result;
  }
};

export { initializeDatabase, DatabaseService };