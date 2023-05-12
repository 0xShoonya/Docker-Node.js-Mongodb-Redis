FROM node:18
WORKDIR /app
COPY package.json .


ARG NODE_ENV
RUN if [ "NODE_ENV" = "development" ]; \
    then npm install; \
    else npm install --only=production; \ 
    fi

RUN npm install nodemon --save-dev

COPY . ./
ENV PORT 3000
EXPOSE $PORT
CMD ["node", "index.js"]