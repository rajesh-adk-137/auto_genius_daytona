# Use the official Node.js 18 image as a base
FROM mcr.microsoft.com/devcontainers/javascript-node:18

# Update and install Python and required dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    python3-venv \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Create a virtual environment for Python
RUN python3 -m venv /opt/venv

# Activate the virtual environment for subsequent RUN commands
ENV PATH="/opt/venv/bin:$PATH"

# Upgrade pip and install pipx
RUN pip install --no-cache-dir --upgrade pip pipx \
    && python3 -m pipx ensurepath

# Default command
CMD ["sleep", "infinity"]