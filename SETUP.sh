#!/bin/bash

# Reelify - Quick Setup Script
# This script sets up both backend and frontend for local development

echo "🎥 Reelify - Quick Setup Script"
echo "================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Node.js is installed
echo -e "${BLUE}Checking prerequisites...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js v16 or higher.${NC}"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo -e "${RED}❌ Node.js version must be 16 or higher. Current version: $(node -v)${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js $(node -v) found${NC}"

# Check if MongoDB is running (optional, could use Atlas)
if command -v mongod &> /dev/null; then
    echo -e "${GREEN}✓ MongoDB found${NC}"
else
    echo -e "${YELLOW}⚠ MongoDB not found locally. You can use MongoDB Atlas instead.${NC}"
fi

echo ""
echo -e "${BLUE}Setting up Backend...${NC}"
echo "----------------------"

# Backend setup
cd backend || exit

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Backend dependencies installed${NC}"
    else
        echo -e "${RED}❌ Failed to install backend dependencies${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✓ Backend dependencies already installed${NC}"
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo -e "${GREEN}✓ .env file created${NC}"
    echo -e "${YELLOW}⚠ Please edit backend/.env and add your MongoDB URI and JWT secret${NC}"
else
    echo -e "${GREEN}✓ .env file exists${NC}"
fi

# Create uploads directory if it doesn't exist
if [ ! -d "uploads" ]; then
    mkdir uploads
    echo "# Uploaded videos" > uploads/.gitkeep
    echo -e "${GREEN}✓ Uploads directory created${NC}"
else
    echo -e "${GREEN}✓ Uploads directory exists${NC}"
fi

cd ..

echo ""
echo -e "${BLUE}Setting up Frontend...${NC}"
echo "----------------------"

# Frontend setup
cd frontend || exit

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
    else
        echo -e "${RED}❌ Failed to install frontend dependencies${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✓ Frontend dependencies already installed${NC}"
fi

cd ..

echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}✓ Setup Complete!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo ""
echo "1. Configure MongoDB:"
echo "   • For local MongoDB: Make sure it's running (mongod)"
echo "   • For MongoDB Atlas: Update backend/.env with your connection string"
echo ""
echo "2. Update backend/.env file:"
echo "   cd backend"
echo "   nano .env  # or use your preferred editor"
echo "   "
echo "   Required settings:"
echo "   - MONGODB_URI (your MongoDB connection string)"
echo "   - JWT_SECRET (a strong random string, min 32 characters)"
echo ""
echo "3. Start the backend server:"
echo "   cd backend"
echo "   npm run dev"
echo "   (Server will run on http://localhost:5000)"
echo ""
echo "4. Start the frontend (in a new terminal):"
echo "   cd frontend"
echo "   npm run dev"
echo "   (App will run on http://localhost:5173)"
echo ""
echo "5. Open your browser to http://localhost:5173"
echo ""
echo -e "${YELLOW}📖 For more information, see:${NC}"
echo "   - PROJECT_README.md (complete guide)"
echo "   - DEPLOYMENT.md (deployment instructions)"
echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"
