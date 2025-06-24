# Use an official Node.js image with Python preinstalled
FROM node:18-bullseye

# Install Python and pip
RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    apt-get clean

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the backend code
COPY . .

# Expose the port your Express app runs on
EXPOSE 8000

# Start the server
CMD ["npm", "start"]
