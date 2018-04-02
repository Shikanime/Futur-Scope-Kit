FROM node:alpine

# Set a working directory
WORKDIR /usr/src/app

COPY ./build/package.json .
COPY ./build/yarn.lock .

# Install application manager
RUN yarn install pm2 -g

# Install Node.js dependencies
RUN yarn install --production --no-progress

# Copy application files
COPY ./build .

# Run the container under "node" user by default
USER node

CMD [ "pm2-runtime", "start", "manager.js" ]
