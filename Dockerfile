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
RUN npx playwright install --with-deps --force

# Debugging: Check if Playwright browsers exist
RUN ls -la $PLAYWRIGHT_BROWSERS_PATH || (echo "Playwright browsers not found!" && exit 1)

# Set the container's time zone to match the host's time zone
# Sync the time with the host system
RUN apt-get update && apt-get install -y tzdata && \
    ln -snf /usr/share/zoneinfo/Etc/UTC /etc/localtime && \
    dpkg-reconfigure --frontend noninteractive tzdata

# Copy the rest of the project files
COPY . .

# Let Render assign the PORT dynamically
ENV PORT $PORT

# Set the command to start the application
CMD ["node", "express-server.js"]
