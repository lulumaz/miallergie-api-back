const argv = require('minimist')(process.argv);

import defaultConfig from './datasources/mongo-ds.datasource.config.json';

const config = {
  mongo: {
    host: argv.mongoHost ? argv.mongoHost : defaultConfig.host,
    connector: 'mongodb',
    port: argv.mongoPort ? argv.mongoPort : defaultConfig.port,
    database: argv.mongoDb ? argv.mongoDb : defaultConfig.database,
  },
  devMode: argv.dev ? argv.dev : false, //production or development
  auth: {
    secretToken: argv.token ? argv.token : 'azfduazeazeazbeiaze',
  },
};

console.log({config});
module.exports = config;
