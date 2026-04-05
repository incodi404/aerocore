# Base
FROM node:20-alpine As Base

# creating workdir
WORKDIR /app

# copy initial files
COPY package.json package-lock.json ./
RUN npm install

# copy all code
COPY . .

# Dev environment
FROM base As dev 
CMD [ "npm", "run", "dev" ]