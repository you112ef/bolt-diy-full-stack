#!/bin/bash

echo "🚀 Setting up Yousef SS - AI Development Platform"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Copy environment file
if [ ! -f ".env.local" ]; then
    echo "📋 Creating environment file..."
    cp .env.example .env.local
    echo "✅ Environment file created. Please edit .env.local with your API keys."
else
    echo "⚠️  .env.local already exists. Skipping..."
fi

# Create public directory if it doesn't exist
mkdir -p public

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To start the development server:"
echo "  npm run dev"
echo ""
echo "To build for production:"
echo "  npm run build && npm run export"
echo ""
echo "📝 Don't forget to:"
echo "  1. Edit .env.local with your API keys"
echo "  2. Configure your AI providers in the UI"
echo "  3. Set up deployment integrations in settings"
echo ""
echo "🌟 Enjoy building with Yousef SS!"