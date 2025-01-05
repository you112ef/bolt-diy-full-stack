# Use a stable CUDA base image
FROM nvidia/cuda:12.2.0-runtime-ubuntu22.04

# Install Python3, pip, and curl (for Ollama installation)
RUN apt-get update && apt-get install -y \
    python3 python3-pip curl \
    && apt-get clean

# Install Ollama CLI (replace with the proper installation method if different)
RUN curl -fsSL https://ollama.com/install.sh | bash

# Expose necessary ports (replace with Ollama's port if required)
EXPOSE 11434

# Default command to run Ollama as a service
CMD ["ollama", "serve"]


