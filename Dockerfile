# syntax=docker/dockerfile:1
# Base Image of node 
FROM node:18.12.0
#Set ENV veriable
ENV NODE_ENV=production

#Set working Directory
WORKDIR /app
# Copy the necessy packages
COPY ["package.json", "package-lock.json*", "./"]
#Run the npm commands 
RUN npm install --production
# Copy everything in current /app directory 
COPY . .
# Strat the node application
CMD [ "node", "server.js" ]