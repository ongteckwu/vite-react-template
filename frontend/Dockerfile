FROM oven/bun:1-alpine

WORKDIR /app

# Copy package files
COPY package.json bun.lock ./

# Install dependencies
RUN bun install

# Copy source code
COPY . .

# Expose Vite port
EXPOSE 5173

# Start the development server
CMD ["bun", "run", "dev", "--host", "0.0.0.0"]