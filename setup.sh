#!/bin/bash
echo "Setting up JotForm E-commerce Frontend..."

# Install dependencies
npm install

# Create necessary directories if they don't exist
mkdir -p public/images
mkdir -p src/components
mkdir -p src/services
mkdir -p src/data

echo "Setup complete! Run 'npm start' to start the development server." 