@echo off
echo Starting services...

REM Check if NVIDIA GPU is present
nvidia-smi >nul 2>&1
if %errorlevel% equ 0 (
    echo NVIDIA GPU detected, using NVIDIA configuration...
    set COMPOSE_FILE=docker-compose-nvidia.yml
) else (
    echo No NVIDIA GPU detected, using AMD configuration...
    set COMPOSE_FILE=docker-compose-amd.yml
)

REM Ask user for profile choice
choice /C SL /M "Select profile: Stable (S) or Latest (L)?"
if %errorlevel% equ 1 (
    set PROFILE=stable
) else (
    set PROFILE=latest
)

docker compose -f %COMPOSE_FILE% --profile %PROFILE% up -d

echo Waiting for Ollama to start...
timeout /t 10 /nobreak

echo Pulling Qwen 7B model...
docker exec -it ollama ollama pull qwen:7b

echo Restarting services...
docker compose -f %COMPOSE_FILE% --profile %PROFILE% restart

echo Opening browser...
start http://localhost:3000

echo Setup complete! You can now use Bolt DIY at http://localhost:3000
echo OpenWebUI is available at http://localhost:8080
