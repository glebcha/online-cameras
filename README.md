# Online Cameras

This app can fetch cameras from open Ivideon api.
Built with:
  - React/Redux
  - Self-made grid with mixins and variables in LESS
  - react-redux-api-middleware
  - BDD in mind


### Preparing

Make sure to `npm i` and check for latest node version (>=6)

### Running
>"start": "NODE_ENV=development webpack-dashboard -c blue -- node app-server.js"
"start-win": "set NODE_ENV=development&& webpack-dashboard -- node app-server.js"

Run dev mode with webpack dashboard in console (start-win is for Windows)

>"start-basic-win": "set NODE_ENV=development&& node app-server.js"

Run dev mode without webpack dashboard in console for Windows

>"build": "NODE_ENV=production webpack --config webpack.config.babel.js"
"build-win": "set NODE_ENV=production&& webpack --config webpack.config.babel.js"

Build application

>"test": "NODE_ENV=test jest"

Run tests (actions+helpers)
