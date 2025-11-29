import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = process.env.DB_PATH || path.join(__dirname, '../../crowdk.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

/**
 * Query wrapper for PostgreSQL-like syntax compatibility
 */
export async function query(sql, params = []) {
  try {
    // Convert PostgreSQL $1, $2 syntax to SQLite ? syntax
    let sqliteSql = sql;
    if (params && params.length > 0) {
      for (let i = params.length; i >= 1; i--) {
        sqliteSql = sqliteSql.replace(new RegExp(`\\$${i}`, 'g'), '?');
      }
    }

    // Determine if SELECT or RETURNING
    if (
      sqliteSql.trim().toUpperCase().startsWith('SELECT') ||
      sqliteSql.toUpperCase().includes('RETURNING')
    ) {
      // Handle RETURNING clause for SQLite
      if (sqliteSql.toUpperCase().includes('RETURNING')) {
        // Extract the returning columns
        const returningMatch = sqliteSql.match(/RETURNING\s+(.+)$/i);
        const returningCols = returningMatch ? returningMatch[1].trim() : '*';
        
        // Remove RETURNING clause
        sqliteSql = sqliteSql.replace(/RETURNING\s+.+$/i, '');
        
        // Execute INSERT/UPDATE/DELETE
        const info = db.prepare(sqliteSql).run(...params);
        
        // Fetch the inserted/updated row
        if (info.lastInsertRowid) {
          const selectSql = `SELECT ${returningCols} FROM ${extractTableName(sqliteSql)} WHERE rowid = ?`;
          const row = db.prepare(selectSql).get(info.lastInsertRowid);
          return { rows: [row] };
        } else {
          return { rows: [] };
        }
      } else {
        // Regular SELECT
        const rows = db.prepare(sqliteSql).all(...params);
        return { rows };
      }
    } else {
      // INSERT, UPDATE, DELETE
      const info = db.prepare(sqliteSql).run(...params);
      return {
        rows: [],
        rowCount: info.changes,
        lastInsertRowid: info.lastInsertRowid,
      };
    }
  } catch (error) {
    console.error('Query error:', error);
    console.error('SQL:', sql);
    console.error('Params:', params);
    throw error;
  }
}

/**
 * Extract table name from SQL
 */
function extractTableName(sql) {
  const match = sql.match(/(?:INTO|UPDATE|FROM)\s+([a-z_]+)/i);
  return match ? match[1] : '';
}

/**
 * Close database connection
 */
export function close() {
  db.close();
}

export default db;
