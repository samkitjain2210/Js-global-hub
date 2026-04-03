#!/bin/bash
# ============================================
# JS GLOBAL HUB - Setup & Deployment Script
# ============================================
# Usage: chmod +x setup.sh && ./setup.sh

set -e

echo "========================================"
echo "  JS GLOBAL HUB - Setup Script"
echo "========================================"
echo ""

# Check for Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo "[OK] Node.js found: $NODE_VERSION"
else
    echo "[ERROR] Node.js is NOT installed."
    echo "  Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

# Check for npm or bun
if command -v bun &> /dev/null; then
    PKG_MANAGER="bun"
    echo "[OK] Bun found"
elif command -v npm &> /dev/null; then
    PKG_MANAGER="npm"
    echo "[OK] npm found"
else
    echo "[ERROR] No package manager found. Please install npm or bun."
    exit 1
fi

echo ""
echo "Step 1/5: Creating environment file..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "  [OK] .env created from .env.example"
else
    echo "  [OK] .env already exists, skipping"
fi

echo ""
echo "Step 2/5: Installing dependencies..."
$PKG_MANAGER install
echo "  [OK] Dependencies installed"

echo ""
echo "Step 3/5: Setting up database..."
mkdir -p prisma

# Generate Prisma client
npx prisma generate
echo "  [OK] Prisma client generated"

# Push schema to database
npx prisma db push
echo "  [OK] Database schema applied"

echo ""
echo "Step 4/5: Seeding products..."
npx tsx src/lib/seed.ts
echo "  [OK] Products seeded"

echo ""
echo "Step 5/5: Build for production..."
npm run build
echo "  [OK] Production build completed"

echo ""
echo "========================================"
echo "  SETUP COMPLETE!"
echo "========================================"
echo ""
echo "  To start the server:"
echo "    npm run start"
echo ""
echo "  Server will run on: http://localhost:3000"
echo ""
echo "  Admin Panel: http://localhost:3000"
echo "  Admin Password: jsglobalhub2024"
echo ""
echo "  For development mode:"
echo "    npm run dev"
echo ""
