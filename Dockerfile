FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application files
COPY . .

# Create resumes directory
RUN mkdir -p resumes

# Expose port
EXPOSE 5000

# Start the application
CMD ["node", "server.js"]


