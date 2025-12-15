# Use official Node image
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm install --production


# Copy rest of the source
COPY . .

# Expose the app port (change if not 3000)
EXPOSE 3000

# Default command (uses "start" script from package.json)
CMD ["npm", "start"]