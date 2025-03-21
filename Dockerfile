# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json first (for caching dependencies)
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy the rest of the project files
COPY . .

# Expose the port dynamically (Render sets the PORT environment variable)
EXPOSE $PORT

# Set the command to start the application
CMD ["node", "express.js"]
