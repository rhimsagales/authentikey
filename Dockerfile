# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json first (for caching dependencies)
COPY package*.json ./

# Install dependencies (including Playwright)
RUN npm install --omit=dev

# Set Playwright's cache path before installing browsers
ENV PLAYWRIGHT_BROWSERS_PATH=/root/.cache/ms-playwright

# Install Playwright browsers with dependencies
RUN npx playwright install --with-deps

# Ensure Playwright dependencies are set at runtime
RUN mkdir -p $PLAYWRIGHT_BROWSERS_PATH && chmod -R 777 $PLAYWRIGHT_BROWSERS_PATH

# Debugging: Check if Playwright browsers exist
RUN ls -la $PLAYWRIGHT_BROWSERS_PATH || (echo "Playwright browsers not found! Reinstalling..." && npx playwright install --force)

# Copy the rest of the project files
COPY . .

# Let Render assign the PORT dynamically
ENV PORT $PORT

# Set the command to start the application
CMD ["node", "express-server.js"]
