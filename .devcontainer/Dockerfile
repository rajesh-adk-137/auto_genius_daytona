# Use the official Node.js 18 image as a base
FROM mcr.microsoft.com/devcontainers/javascript-node:18

# Update and install Python, pip, and any required dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /workspaces

# Default command
CMD ["sleep", "infinity"]