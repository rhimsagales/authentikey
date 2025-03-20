#!/bin/bash
set -e  # Stop script if any command fails
set -x  # Print each command before running

# Install Playwright dependencies manually (without sudo)
npx playwright install-deps

# Install Playwright browsers
npx playwright install

# Continue with your build process
yarn build  # (Replace with your actual build command)
