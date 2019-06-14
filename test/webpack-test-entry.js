require('../src/polyfills');
const context = require.context('../src', true, /spec\.js$/);
context.keys().forEach(context);
module.exports = context;
