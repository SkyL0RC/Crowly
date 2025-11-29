import { query } from './connection.js';

/**
 * Database migration script
 * Creates all necessary tables for the CroWDK Wallet
 */

const migrations = [
  // Users table
  `CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  )`,

  // Wallets table
  `CREATE TABLE IF NOT EXISTS wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    address VARCHAR(255) NOT NULL,
    network VARCHAR(50) NOT NULL,
    network_type VARCHAR(20) NOT NULL,
    encrypted_private_key TEXT NOT NULL,
    public_key TEXT,
    derivation_path VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(address, network)
  )`,

  // Transactions table
  `CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID REFERENCES wallets(id) ON DELETE CASCADE,
    tx_hash VARCHAR(255) UNIQUE NOT NULL,
    type VARCHAR(20) NOT NULL,
    from_address VARCHAR(255) NOT NULL,
    to_address VARCHAR(255) NOT NULL,
    amount DECIMAL(36, 18) NOT NULL,
    token_symbol VARCHAR(50) NOT NULL,
    token_address VARCHAR(255),
    status VARCHAR(20) NOT NULL,
    gas_used DECIMAL(18, 8),
    gas_fee DECIMAL(18, 8),
    gas_price DECIMAL(18, 8),
    confirmations INT DEFAULT 0,
    block_number BIGINT,
    network VARCHAR(50) NOT NULL,
    network_type VARCHAR(20) NOT NULL,
    metadata JSONB,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  )`,

  // Token balances cache table
  `CREATE TABLE IF NOT EXISTS token_balances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID REFERENCES wallets(id) ON DELETE CASCADE,
    token_symbol VARCHAR(50) NOT NULL,
    token_name VARCHAR(100),
    token_address VARCHAR(255),
    balance DECIMAL(36, 18) NOT NULL DEFAULT 0,
    decimals INT NOT NULL DEFAULT 18,
    network VARCHAR(50) NOT NULL,
    usd_value DECIMAL(18, 2) DEFAULT 0,
    last_updated TIMESTAMP DEFAULT NOW(),
    UNIQUE(wallet_id, token_address, network)
  )`,

  // Price cache table
  `CREATE TABLE IF NOT EXISTS price_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    symbol VARCHAR(50) UNIQUE NOT NULL,
    usd_price DECIMAL(18, 8) NOT NULL,
    change_24h DECIMAL(10, 4),
    market_cap DECIMAL(20, 2),
    volume_24h DECIMAL(20, 2),
    last_updated TIMESTAMP DEFAULT NOW()
  )`,

  // Address book table
  `CREATE TABLE IF NOT EXISTS address_book (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    network VARCHAR(50) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, address, network)
  )`,

  // Session table for auth
  `CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  )`,

  // Indexes for performance
  `CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON wallets(user_id)`,
  `CREATE INDEX IF NOT EXISTS idx_wallets_address ON wallets(address)`,
  `CREATE INDEX IF NOT EXISTS idx_transactions_wallet_id ON transactions(wallet_id)`,
  `CREATE INDEX IF NOT EXISTS idx_transactions_hash ON transactions(tx_hash)`,
  `CREATE INDEX IF NOT EXISTS idx_transactions_addresses ON transactions(from_address, to_address)`,
  `CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC)`,
  `CREATE INDEX IF NOT EXISTS idx_token_balances_wallet_id ON token_balances(wallet_id)`,
  `CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id)`,
  `CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token)`,
];

/**
 * Run all migrations
 */
export async function runMigrations() {
  console.log('Starting database migrations...');
  
  try {
    for (const [index, migration] of migrations.entries()) {
      console.log(`Running migration ${index + 1}/${migrations.length}...`);
      await query(migration);
    }
    
    console.log('✓ All migrations completed successfully');
    return true;
  } catch (error) {
    console.error('Migration error:', error);
    throw error;
  }
}

/**
 * Drop all tables (use with caution!)
 */
export async function dropAllTables() {
  const tables = [
    'sessions',
    'address_book',
    'price_cache',
    'token_balances',
    'transactions',
    'wallets',
    'users',
  ];

  console.log('⚠️  Dropping all tables...');
  
  try {
    for (const table of tables) {
      await query(`DROP TABLE IF EXISTS ${table} CASCADE`);
      console.log(`Dropped table: ${table}`);
    }
    console.log('✓ All tables dropped');
  } catch (error) {
    console.error('Error dropping tables:', error);
    throw error;
  }
}

// Run migrations if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const action = process.argv[2];
  
  if (action === 'drop') {
    await dropAllTables();
  } else {
    await runMigrations();
  }
  
  process.exit(0);
}
