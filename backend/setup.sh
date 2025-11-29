#!/bin/bash

echo "🚀 CroWDK Backend Setup Script"
echo "================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
echo "📦 Checking prerequisites..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 16 or higher.${NC}"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo -e "${RED}❌ Node.js version 16 or higher is required. Current version: $(node -v)${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js $(node -v) is installed${NC}"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo -e "${YELLOW}⚠️  PostgreSQL is not installed. Install with: brew install postgresql${NC}"
    echo "   Then run: brew services start postgresql"
else
    echo -e "${GREEN}✓ PostgreSQL is installed${NC}"
fi

# Check if Redis is installed
if ! command -v redis-cli &> /dev/null; then
    echo -e "${YELLOW}⚠️  Redis is not installed. Install with: brew install redis${NC}"
    echo "   Then run: brew services start redis"
else
    echo -e "${GREEN}✓ Redis is installed${NC}"
    
    # Check if Redis is running
    if redis-cli ping &> /dev/null; then
        echo -e "${GREEN}✓ Redis is running${NC}"
    else
        echo -e "${YELLOW}⚠️  Redis is not running. Start with: brew services start redis${NC}"
    fi
fi

echo ""
echo "📥 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Dependencies installed${NC}"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo ""
    echo "⚙️  Creating .env file..."
    cp .env.example .env
    echo -e "${GREEN}✓ .env file created${NC}"
    echo -e "${YELLOW}⚠️  Please edit .env file with your configuration before running the server${NC}"
    echo ""
    echo "Required configurations:"
    echo "  - Database credentials (DB_PASSWORD)"
    echo "  - WDK RPC URLs and API keys"
    echo "  - JWT_SECRET"
    echo "  - CoinGecko API key (optional)"
else
    echo -e "${GREEN}✓ .env file already exists${NC}"
fi

echo ""
echo "🗄️  Database setup..."
read -p "Do you want to create the database and run migrations now? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Check if database exists
    if psql -lqt | cut -d \| -f 1 | grep -qw crowdk_wallet; then
        echo -e "${YELLOW}⚠️  Database 'crowdk_wallet' already exists${NC}"
    else
        echo "Creating database..."
        createdb crowdk_wallet
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✓ Database created${NC}"
        else
            echo -e "${RED}❌ Failed to create database${NC}"
            echo "Create it manually with: createdb crowdk_wallet"
        fi
    fi
    
    echo ""
    echo "Running migrations..."
    npm run migrate
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Migrations completed${NC}"
    else
        echo -e "${RED}❌ Migrations failed${NC}"
    fi
fi

echo ""
echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Edit .env file with your configuration"
echo "  2. Start PostgreSQL: brew services start postgresql"
echo "  3. Start Redis: brew services start redis"
echo "  4. Run development server: npm run dev"
echo "  5. Or start production server: npm start"
echo ""
echo "Documentation: See README.md for detailed setup instructions"
echo ""
