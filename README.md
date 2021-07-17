# VTT Creator

A tool for creating and editing [Web Video Text Track (WebVTT)](https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API) files in your browser.

Check it out at [vtt-creator.com](https://vtt-creator.com).

**This repository, along with the [backend app](https://github.com/roballsopp/vtt-creator-backend), is a full single page app and is open source mostly for portfolio reasons. I don't really expect/support usage of the source code. Use VTT Creator via the live hosted version at [vtt-creator.com](https://vtt-creator.com).**

If you're actually interested in running this source code, you'll need:
* A Google Cloud account
    * VTT Creator will need a Cloud Storage bucket, access to the Cloud Speech to Text API, and a service account with appropriate permissions
* An AWS account
    * VTT Creator uses Amazon Cognito for user management
* A Paypal account
* PostgreSQL
* The VTT Creator [Backend Application](https://github.com/roballsopp/vtt-creator-backend)

To run this project, you'll also need to supply some environment variables to configure it:
```
API_URL=<url to wherever you've hosted to backend app>
SPEECH_TO_TEXT_JOB_TIMEOUT=<a number, milliseconds>
DEBUG=<true|false>
COGNITO_CLIENT_ID=<client id for aws cognito client>
COGNITO_DOMAIN=<client domain url for aws cognito>
COGNITO_USER_POOL_ID=<aws cognito pool id>
PAYPAL_CLIENT_ID=<your paypal client id>
SENTRY_DSN=<sentry.io dsn>
```

## Development
Install dependencies with:
```bash
npm install
```
To run the app in dev mode, run:
```bash
npm start
```
By default, the app will be available at [http://localhost:3000](http://localhost:3000). To change the port, open up the `webpack.dev.js` file located in the project root and change the `devServer.port` entry to your desired port.

To run tests:
```bash
npm run test
```

This project uses [karma](https://karma-runner.github.io) for its test runner, which runs tests in [headless chrome](https://developers.google.com/web/updates/2017/04/headless-chrome). If you don't have chrome installed, you might have to tweak the `karma.conf.js` file located in the project root to [use a different browser](http://karma-runner.github.io/4.0/config/browsers.html).

## License
No license is given. All rights reserved.
