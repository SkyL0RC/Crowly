import db from './sqlite.js';

console.log('📦 Creating SQLite database tables...\n');

try {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      email TEXT UNIQUE,
      password_hash TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);
  console.log('✅ Users table created');

  // Wallets table
  // ⚠️ SECURITY: encrypted_private_key KALDIRILDI!
  // Seed phrases ASLA database'de saklanmaz (WDK Best Practice)
  db.exec(`
    CREATE TABLE IF NOT EXISTS wallets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT,
      address TEXT NOT NULL,
      network TEXT NOT NULL,
      network_type TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(address, network)
    )
  `);
  console.log('✅ Wallets table created (NO sensitive data storage!)');

  // Transactions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      wallet_id INTEGER,
      tx_hash TEXT UNIQUE NOT NULL,
      type TEXT NOT NULL,
      from_address TEXT NOT NULL,
      to_address TEXT NOT NULL,
      amount REAL NOT NULL,
      token_symbol TEXT,
      status TEXT DEFAULT 'pending',
      gas_used TEXT,
      gas_fee TEXT,
      gas_price TEXT,
      network TEXT NOT NULL,
      network_type TEXT NOT NULL,
      block_number INTEGER,
      confirmation_count INTEGER DEFAULT 0,
      metadata TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE SET NULL
    )
  `);
  console.log('✅ Transactions table created');

  // Token balances table
  db.exec(`
    CREATE TABLE IF NOT EXISTS token_balances (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      wallet_id INTEGER NOT NULL,
      token_symbol TEXT NOT NULL,
      token_name TEXT,
      contract_address TEXT,
      balance REAL NOT NULL DEFAULT 0,
      decimals INTEGER DEFAULT 18,
      last_updated TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE CASCADE,
      UNIQUE(wallet_id, token_symbol, contract_address)
    )
  `);
  console.log('✅ Token balances table created');

  // Price cache table
  db.exec(`
    CREATE TABLE IF NOT EXISTS price_cache (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      token_symbol TEXT UNIQUE NOT NULL,
      usd_price REAL NOT NULL,
      change_24h REAL,
      market_cap REAL,
      volume_24h REAL,
      last_updated TEXT DEFAULT (datetime('now'))
    )
  `);
  console.log('✅ Price cache table created');

  // Address book table
  db.exec(`
    CREATE TABLE IF NOT EXISTS address_book (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      address TEXT NOT NULL,
      network TEXT NOT NULL,
      notes TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(user_id, address, network)
    )
  `);
  console.log('✅ Address book table created');

  // Sessions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      token TEXT UNIQUE NOT NULL,
      expires_at TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
  console.log('✅ Sessions table created');

  // Create indexes for better performance
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_wallets_address ON wallets(address);
    CREATE INDEX IF NOT EXISTS idx_wallets_network ON wallets(network);
    CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON wallets(user_id);
    
    CREATE INDEX IF NOT EXISTS idx_transactions_hash ON transactions(tx_hash);
    CREATE INDEX IF NOT EXISTS idx_transactions_wallet ON transactions(wallet_id);
    CREATE INDEX IF NOT EXISTS idx_transactions_from ON transactions(from_address);
    CREATE INDEX IF NOT EXISTS idx_transactions_to ON transactions(to_address);
    CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
    CREATE INDEX IF NOT EXISTS idx_transactions_created ON transactions(created_at);
    
    CREATE INDEX IF NOT EXISTS idx_token_balances_wallet ON token_balances(wallet_id);
    CREATE INDEX IF NOT EXISTS idx_token_balances_symbol ON token_balances(token_symbol);
    
    CREATE INDEX IF NOT EXISTS idx_address_book_user ON address_book(user_id);
    
    CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
    CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
  `);
  console.log('✅ Indexes created');

  console.log('\n🎉 Database migration completed successfully!\n');
  process.exit(0);
} catch (error) {
  console.error('\n❌ Migration error:', error.message);
  process.exit(1);
}
