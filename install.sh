#!/bin/bash

echo "Starting services..."

# Check if NVIDIA GPU is present
if command -v nvidia-smi &> /dev/null; then
    echo "NVIDIA GPU detected, using NVIDIA configuration..."
    COMPOSE_FILE="docker-compose-nvidia.yml"
else
    echo "No NVIDIA GPU detected, using AMD configuration..."
    COMPOSE_FILE="docker-compose-amd.yml"
fi

# Ask user for profile choice
echo "Select profile:"
select PROFILE in "stable" "latest"; do
    if [[ -n "$PROFILE" ]]; then
        break
    fi
done

docker compose -f $COMPOSE_FILE --profile $PROFILE up -d

echo "Waiting for Ollama to start..."
sleep 10

echo "Pulling Qwen 7B model..."
docker exec -it ollama ollama pull qwen:7b

echo "Restarting services..."
docker compose -f $COMPOSE_FILE --profile $PROFILE restart

echo "Opening browser..."
xdg-open http://localhost:3000 &

echo "Setup complete! You can now use Bolt DIY at http://localhost:3000"
echo "OpenWebUI is available at http://localhost:8080"
