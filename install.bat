@echo off
echo Starting services...

REM Check if NVIDIA GPU is present
nvidia-smi >nul 2>&1
if %errorlevel% equ 0 (
    echo NVIDIA GPU detected, using NVIDIA configuration...
    docker compose -f docker-compose-nvidia.yml up -d
) else (
    echo No NVIDIA GPU detected, using AMD configuration...
    docker compose -f docker-compose-amd.yml up -d
)

echo Waiting for Ollama to start...
timeout /t 10 /nobreak

echo Pulling Qwen 7B model...
docker exec -it ollama ollama pull qwen:7b

echo Restarting services...
if %errorlevel% equ 0 (
    docker compose -f docker-compose-nvidia.yml restart
) else (
    docker compose -f docker-compose-amd.yml restart
)

echo Opening browser...
start http://localhost:3000

echo Setup complete! You can now use Bolt DIY at http://localhost:3000
echo OpenWebUI is available at http://localhost:8080 