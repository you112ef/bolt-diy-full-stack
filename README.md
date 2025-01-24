# Local AI Development Environment

This project sets up a local AI development environment with Ollama, OpenWebUI, and Bolt DIY, supporting both NVIDIA and AMD GPUs.

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/leex279/bolt-diy-full-stack.git
```

2. Navigate to the project directory:
```bash
cd bolt-diy-full-stack
```

## Prerequisites

- Docker and Docker Compose
  - [Install Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/)
  - [Docker Compose Installation](https://docs.docker.com/compose/install/)

- For NVIDIA GPUs:
  - [Latest NVIDIA Drivers](https://www.nvidia.com/Download/index.aspx)
  - [NVIDIA Container Toolkit Installation](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/install-guide.html#docker)

- For AMD GPUs:
  - Windows:
    - ⚠️ **Important Note**: ROCm containers are currently not supported natively on Windows. You have two options:
      1. Use WSL2 with Ubuntu and follow the [ROCm Installation Guide for Linux](https://rocm.docs.amd.com/projects/install-on-linux/en/latest/)
      2. Use the CPU-only version by removing the GPU-related configurations from the docker-compose file
  - Linux:
    - [ROCm Installation Guide for Linux](https://rocm.docs.amd.com/projects/install-on-linux/en/latest/)
    - Follow the Quick Start guide for your specific Linux distribution
  - [Supported GPUs List](https://rocm.docs.amd.com/en/latest/release/gpu_os_support.html)

## Quick Start (Windows)

For Windows users, we provide an automated installation script:

1. Double-click `install.bat` or run from command prompt:
```bash
.\install.bat
```

This script will:
- Start the appropriate services based on your GPU (NVIDIA or AMD)
- Pull the Qwen 7B model
- Open your browser to the Bolt DIY interface

Note: The initial model download may take several minutes depending on your internet connection.

## Project Structure

```
project/
├── docker-compose-amd.yml
├── docker-compose-nvidia.yml
├── Dockerfile
├── .env.local
└── README.md
```

## Setup Instructions

### 1. Environment Setup

Create a `.env.local` file for Bolt DIY configuration (if needed).

### 2. Starting the Services

For NVIDIA GPUs:
```bash
docker compose -f docker-compose-nvidia.yml up -d
```
Note: This will automatically build the custom Ollama image on first run.

For AMD GPUs:
```bash
docker compose -f docker-compose-amd.yml up -d
```
Note: AMD version uses pre-built images.

### 3. Accessing the Services

- Ollama API: `http://localhost:11434`
- OpenWebUI: `http://localhost:8080`
- Bolt DIY: `http://localhost:3000`

## Common Commands

Stop services:
```bash
docker compose -f docker-compose-[nvidia/amd].yml down
```

View logs:
```bash
docker compose -f docker-compose-[nvidia/amd].yml logs -f
```

Rebuild and restart:
```bash
docker compose -f docker-compose-[nvidia/amd].yml up -d --build
```

## Service Details

### Ollama
- Port: 11434
- GPU-enabled for both AMD and NVIDIA
- Persistent storage for models

### OpenWebUI
- Port: 8080
- Web interface for Ollama
- Persistent model storage

### Bolt DIY
- Port: 3000
- Development environment
- Requires `.env.local` configuration

## Volumes

The following persistent volumes are created:
- `ollama`: For Ollama model storage
- `openwebui-data`: For OpenWebUI data
- `bolt-diy-data`: For Bolt DIY data

## Troubleshooting

1. **GPU Issues:**
   - For NVIDIA: Run `nvidia-smi` to verify GPU detection
   - For AMD on Windows:
     - ROCm containers are not supported natively on Windows
     - Use WSL2 with Ubuntu for AMD GPU support
     - Or use CPU-only mode by removing GPU configurations
   - For AMD: Check ROCm installation and compatibility

2. **Container Issues:**
   - Check logs: `docker compose -f docker-compose-[nvidia/amd].yml logs [service-name]`
   - Verify port availability
   - Ensure Docker has GPU access

3. **Network Issues:**
   - Verify `host.docker.internal` resolution
   - Check if required ports are not in use
   - Ensure services are on the same network

## Additional Resources

- [Ollama Documentation](https://github.com/ollama/ollama/tree/main/docs)
- [OpenWebUI Documentation](https://github.com/open-webui/open-webui)
- [Bolt DIY Documentation](https://stackblitz-labs.github.io/bolt.diy/)

## Using WSL2 for AMD GPU Support

### 1. Install and Setup WSL2

1. Open PowerShell as Administrator and run:
```powershell
wsl --install
```

2. Restart your computer when prompted.

3. Install Ubuntu from Microsoft Store or via PowerShell:
```powershell
wsl --install -d Ubuntu
```

### 2. Setup ROCm in WSL2

1. Open Ubuntu in WSL2:
```powershell
wsl -d Ubuntu
```

2. Update the system:
```bash
sudo apt update && sudo apt upgrade -y
```

3. Install ROCm:

First, remove any existing ROCm installations:
```bash
sudo apt purge rocm-* hip-* rocminfo
sudo apt autoremove
```

Add the ROCm repository:
```bash
sudo mkdir --parents --mode=0755 /etc/apt/keyrings
wget https://repo.radeon.com/rocm/rocm.gpg.key -O - | \
    gpg --dearmor | sudo tee /etc/apt/keyrings/rocm.gpg > /dev/null

echo "deb [arch=amd64 signed-by=/etc/apt/keyrings/rocm.gpg] https://repo.radeon.com/rocm/apt/debian jammy main" | \
    sudo tee /etc/apt/sources.list.d/rocm.list

echo -e 'Package: *\nPin: release o=repo.radeon.com\nPin-Priority: 600' | \
    sudo tee /etc/apt/preferences.d/rocm-pin-600
```

Install ROCm packages:
```bash
sudo apt update
sudo apt install rocm-hip-runtime rocm-hip-sdk
```

4. Add user to video group:
```bash
sudo usermod -aG video $LOGNAME
sudo usermod -aG render $LOGNAME
```

5. Set up environment variables:
```bash
echo 'export PATH=$PATH:/opt/rocm/bin' >> ~/.bashrc
echo 'export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/opt/rocm/lib' >> ~/.bashrc
source ~/.bashrc
```

6. Verify installation:
```bash
rocminfo
```

If successful, you should see information about your AMD GPU.

### 3. Running Docker Compose in WSL2

1. Navigate to your project directory in WSL2:
```bash
cd /mnt/c/Users/YourUsername/Documents/GitHub/bolt-diy-full-stack
```

2. Start the services:
```bash
docker compose -f docker-compose-amd.yml up -d
```

### 4. Accessing Services

The services will be available at the same ports as before:
- Ollama API: `http://localhost:11434`
- OpenWebUI: `http://localhost:8080`
- Bolt DIY: `http://localhost:3000`

### WSL2 Useful Commands

- List installed WSL distributions:
```powershell
wsl --list --verbose
```

- Set Ubuntu as default WSL distribution:
```powershell
wsl --set-default Ubuntu
```

- Access WSL2 Ubuntu directly:
```powershell
wsl
```

- Shutdown WSL:
```powershell
wsl --shutdown
```

## Using Ollama Models

After starting the services, you can pull and use models through either the CLI or OpenWebUI.

### Pull Models via CLI

```bash
docker exec -it ollama ollama pull qwen:7b
```

Note: Initial model download may take several minutes depending on your internet connection and hardware.

### Alternative: Using OpenWebUI

1. Open OpenWebUI in your browser: `http://localhost:8080`
2. Click on "Create New Chat"
3. Select "Download New Model"
4. Search for "qwen" and select "qwen:7b"
5. Click "Download"

### Verify Model Installation

Check if the model was downloaded successfully:
```bash
docker exec -it ollama ollama list
```

You should see `qwen:7b` in the list of available models.

### Start Chatting

- Via OpenWebUI: Navigate to `http://localhost:8080` and start a new chat with qwen:7b
- Via Bolt DIY: Navigate to `http://localhost:3000` and connect to your local Ollama instance


