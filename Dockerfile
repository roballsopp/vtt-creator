FROM netlify/build:xenial

WORKDIR /usr/app/

COPY . ./

RUN npm install

CMD npm run test-ci
