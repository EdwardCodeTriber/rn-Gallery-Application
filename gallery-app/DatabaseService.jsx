import * as SQLite from 'expo-sqlite';

// Open database
const openDatabase = async () => {
  try {
    const db = await SQLite.openDatabaseAsync('gallery.db');
    
    // Set WAL journal mode for better performance
    await db.execAsync(`PRAGMA journal_mode = WAL;`);
    
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

  // Add new image with various parameter binding methods
  addImage: async (uri, latitude, longitude, description) => {
    const db = await DatabaseService.getDatabase();
    
    // Method 1: Array-based parameter binding
    const result = await db.runAsync(
      'INSERT INTO images (uri, latitude, longitude, description) VALUES (?, ?, ?, ?)',
      [uri, latitude, longitude, description]
    );
    
    return result.lastInsertRowId;
  },

  // Get all images with different retrieval methods
  getAllImages: async () => {
    const db = await DatabaseService.getDatabase();
    
    // Method 1: Get all rows as an array
    const allImages = await db.getAllAsync(
      'SELECT * FROM images ORDER BY timestamp DESC'
    );
    
    // Method 2: Iterate through rows
    const iteratedImages = [];
    for await (const row of db.getEachAsync('SELECT * FROM images ORDER BY timestamp DESC')) {
      iteratedImages.push(row);
    }
    
    // Method 3: Get first image
    const firstImage = await db.getFirstAsync('SELECT * FROM images ORDER BY timestamp DESC');
    
    return {
      allImages,
      iteratedImages,
      firstImage
    };
  },

  // Delete image by ID with different parameter binding
  deleteImage: async (id) => {
    const db = await DatabaseService.getDatabase();
    
    // Method 1: Array-based parameter binding
    const resultArray = await db.runAsync(
      'DELETE FROM images WHERE id = ?',
      [id]
    );
    
    // Method 2: Named parameter binding
    const resultNamed = await db.runAsync(
      'DELETE FROM images WHERE id = $imageId',
      { $imageId: id }
    );
    
    return {
      arrayBinding: resultArray,
      namedBinding: resultNamed
    };
  },

  // Search images with multiple parameter binding and retrieval methods
  searchImages: async (query) => {
    const db = await DatabaseService.getDatabase();
    
    // Method 1: Array-based LIKE search
    const arrayResults = await db.getAllAsync(
      'SELECT * FROM images WHERE description LIKE ? OR latitude LIKE ? OR longitude LIKE ?',
      [`%${query}%`, `%${query}%`, `%${query}%`]
    );
    
    // Method 2: Named parameter LIKE search
    const namedResults = await db.getAllAsync(
      'SELECT * FROM images WHERE description LIKE $query OR latitude LIKE $query OR longitude LIKE $query',
      { $query: `%${query}%` }
    );
    
    // Method 3: Get first matching result
    const firstResult = await db.getFirstAsync(
      'SELECT * FROM images WHERE description LIKE ? OR latitude LIKE ? OR longitude LIKE ? LIMIT 1',
      [`%${query}%`, `%${query}%`, `%${query}%`]
    );
    
    return {
      arrayResults,
      namedResults,
      firstResult
    };
  },

  // Additional utility methods
  getImageCount: async () => {
    const db = await DatabaseService.getDatabase();
    
    const countResult = await db.getFirstAsync('SELECT COUNT(*) as count FROM images');
    return countResult.count;
  },

  // Batch operations example
  batchInsert: async (images) => {
    const db = await DatabaseService.getDatabase();
    
    // Use execAsync for multiple inserts
    const insertQuery = images.map(img => 
      `INSERT INTO images (uri, latitude, longitude, description) VALUES ('${img.uri}', ${img.latitude}, ${img.longitude}, '${img.description}')`
    ).join(';');
    
    await db.execAsync(insertQuery);
  }
};

export { initializeDatabase, DatabaseService };