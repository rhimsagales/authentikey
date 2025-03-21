# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json first (for caching dependencies)
COPY package*.json ./

# Install dependencies (including Playwright)
RUN npm install --omit=dev

# Install Playwright browsers **without requiring root permissions**
RUN npx playwright install --with-deps

# Copy the rest of the project files
COPY . .

# Ensure Playwright dependencies are installed at runtime
ENV PLAYWRIGHT_BROWSERS_PATH=/app/node_modules/.cache/ms-playwright

# Expose the port dynamically (Render sets the PORT environment variable)
EXPOSE $PORT

# Set the command to start the application
CMD ["node", "express-server.js"]
