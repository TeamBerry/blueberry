# Create image based on Node 8
FROM node:8

# Create a directory to place the app
RUN mkdir -p /usr/src/pneuma

# Change directory to run commands
WORKDIR /usr/src/pneuma

# Copy dependency file
COPY package.json /usr/src/pneuma

# Install dependencies
RUN npm install

# Get code
COPY . /usr/src/pneuma

# Expose 4200
EXPOSE 4200

# Serve
CMD ["npm", "start"]