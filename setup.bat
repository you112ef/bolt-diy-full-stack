@echo off
echo 🚀 Setting up Yousef SS - AI Development Platform
echo ==================================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ and try again.
    pause
    exit /b 1
)

echo ✅ Node.js detected
node --version

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully

REM Copy environment file
if not exist ".env.local" (
    echo 📋 Creating environment file...
    copy .env.example .env.local
    echo ✅ Environment file created. Please edit .env.local with your API keys.
) else (
    echo ⚠️  .env.local already exists. Skipping...
)

REM Create public directory if it doesn't exist
if not exist "public" mkdir public

echo.
echo 🎉 Setup complete!
echo.
echo To start the development server:
echo   npm run dev
echo.
echo To build for production:
echo   npm run build ^&^& npm run export
echo.
echo 📝 Don't forget to:
echo   1. Edit .env.local with your API keys
echo   2. Configure your AI providers in the UI
echo   3. Set up deployment integrations in settings
echo.
echo 🌟 Enjoy building with Yousef SS!
pause