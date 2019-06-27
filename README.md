# VTT Creator

A tool for creating and editing [Web Video Text Track (WebVTT)](https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API) files in your browser.

Check it out at [vtt-creator.com](https://vtt-creator.com).

## Development
To get started, open a terminal window and navigate to the project root. Install dependencies with:
```bash
yarn
```
To run the app, run:
```bash
yarn start
```
By default, the app will be available at [http://localhost:3000](http://localhost:3000). To change the port, open up the `webpack.dev.js` file located in the project root and change the `devServer.port` entry to your desired port.

To run tests, simply type:
```bash
yarn test
```

This project uses [karma](https://karma-runner.github.io) for its test runner, which runs tests in [headless chrome](https://developers.google.com/web/updates/2017/04/headless-chrome). If you don't have chrome installed, you might have to tweak the `karma.conf.js` file located in the project root to [use a different browser](http://karma-runner.github.io/4.0/config/browsers.html).

#### Backend
One of the features of this app is the ability to automatically extract the text for caption/subtitle files directly from a video using the [Cloud Speech-to-Text API](https://cloud.google.com/speech-to-text/docs/). For this to work, you'll need to be running the [VTT Creator backend](https://github.com/roballsopp/vtt-creator-backend) node app. See that repo's readme for setup instructions.

If you are running the backend, you'll need to make sure the `API_URL` environment variable in the `.env.dev` file is set to point at your running api instance. This variable points at `http://localhost:3001` by default.

If you are not running the backend, make sure the `API_URL` env var is empty or not present: `API_URL=`. This will disable any features in this application that require api access.
