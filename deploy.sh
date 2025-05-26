#!/bin/bash

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm install -g vercel
fi

# Build the project
echo "Building the project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "Build successful! Deploying to Vercel..."
    
    # Deploy to Vercel
    vercel deploy --prod
    
    # Check if deployment was successful
    if [ $? -eq 0 ]; then
        echo "Deployment successful! Your site is now live."
    else
        echo "Deployment failed. Please check the error messages above."
    fi
else
    echo "Build failed. Please check the error messages above."
fi 