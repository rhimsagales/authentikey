#!/bin/sh
set -e  # Stop the script if any command fails

echo "Installing system dependencies for Playwright..."
apt-get update && apt-get install -y libnss3 libatk1.0-0 libx11-xcb1

echo "Installing Playwright..."
npx playwright install --with-deps
