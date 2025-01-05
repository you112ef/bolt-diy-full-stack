# Ollama NVIDIA GPU with OpenWebUI Docker - Setup (Windows)

This guide explains how to set up Ollama with OpenWebUI using Docker on Windows with NVIDIA GPU support.

## Prerequisites

1. **Internet Access**: Ensure your machine has a stable internet connection
2. **NVIDIA GPU Driver**: Install the latest GPU drivers from [NVIDIA's website](https://www.nvidia.com/Download/index.aspx)
3. **Docker Desktop**: Install Docker Desktop with WSL 2 integration
4. **WSL 2**: Set up Windows Subsystem for Linux

## Project Structure

Create a new directory for your project and add these files:

```bash
your-project/
├── Dockerfile
├── docker-compose.yml
└── README.md
```

## Configuration Files

### 1. Dockerfile

```dockerfile
FROM nvidia/cuda:12.2.0-runtime-ubuntu22.04

# Install Python3, pip, and curl
RUN apt-get update && apt-get install -y \
    python3 python3-pip curl \
    && apt-get clean

# Install Ollama CLI
RUN curl -fsSL https://ollama.com/install.sh | bash

# Expose Ollama port
EXPOSE 11434

# Start Ollama service
CMD ["ollama", "serve"]
```

### 2. docker-compose.yml

```yaml
networks:
  shared_network:
    driver: bridge

services:
  ollama:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "11434:11434"
    runtime: nvidia
    networks:
      - shared_network
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: all
              capabilities: [gpu]
    environment:
      - NVIDIA_VISIBLE_DEVICES=all
      - NVIDIA_DRIVER_CAPABILITIES=compute,utility
      - OLLAMA_HOST=0.0.0.0:11434
      - OLLAMA_DEBUG=true
    restart: unless-stopped

  openwebui:
    image: ghcr.io/open-webui/open-webui:latest
    ports:
      - "8080:8080"
    runtime: nvidia
    networks:
      - shared_network
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: all
              capabilities: [gpu]
    environment:
      - NVIDIA_VISIBLE_DEVICES=all
      - NVIDIA_DRIVER_CAPABILITIES=compute,utility
      - OLLAMA_URL=http://ollama:11434
    volumes:
      - openwebui-data:/usr/src/app/models
    restart: unless-stopped

volumes:
  openwebui-data:
```

## Setup Instructions

### 1. Build and Start Services

Run the following command in your project directory:

```bash
docker-compose up --build
```

### 2. Pull Models

After the services are running, you can pull models using:

```bash
# First, find your container name
docker ps

# Then pull the model
docker exec -it <container-name> bash -c "ollama pull qwen2.5-coder:7b"
```

### 3. Access the Services

- Ollama API: `http://localhost:11434`
- OpenWebUI: `http://localhost:8080`

### 4. Verify GPU Support

Check if the container can access your NVIDIA GPU:

```bash
docker exec -it <container-name> nvidia-smi
```

## Common Commands

1. **Start the services:**
   ```bash
   docker-compose up -d
   ```

2. **Stop the services:**
   ```bash
   docker-compose down
   ```

3. **View logs:**
   ```bash
   docker-compose logs -f
   ```

4. **Restart services:**
   ```bash
   docker-compose restart
   ```

## Troubleshooting

1. **Container won't start:**
   - Check if Docker Desktop is running
   - Verify NVIDIA Container Toolkit installation
   - Check the logs: `docker-compose logs`

2. **GPU not detected:**
   - Verify NVIDIA drivers are installed
   - Check NVIDIA Container Toolkit configuration
   - Run `nvidia-smi` on host to verify GPU is recognized

3. **Network Issues:**
   - Verify internet connectivity
   - Check if ports 11434 and 8080 are available
   - Ensure Docker can access Docker Hub

4. **Model Pull Failures:**
   - Check internet connection
   - Verify container has enough disk space
   - Check Ollama service logs

## Additional Resources

- [Ollama Documentation](https://ollama.ai/docs)
- [OpenWebUI GitHub](https://github.com/open-webui/open-webui)
- [NVIDIA Container Toolkit Documentation](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/overview.html)
- [Docker Documentation](https://docs.docker.com/)

## Support

If you encounter any issues:
1. Check the container logs
2. Verify your configuration matches the examples
3. Ensure all prerequisites are properly installed
4. Check for any system resource limitations

Remember to always use the latest stable versions of Docker and NVIDIA driversfor the best compatibility.
