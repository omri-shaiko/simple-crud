/**
 * Main application routes
 */

'use strict';

import errors from './components/errors';
import path from 'path';
import pluralize from 'pluralize';


module.exports = function(app) {
  //Generate route for each model file
  var normalizedPath = require('path').join(__dirname, '../models');
  require('fs').readdirSync(normalizedPath).forEach(function(file) {
    let model = require('../models/' + file);
    app.use(`/api/${pluralize(model.name)}`, require('./api/generator')(model));
  });
  
  app.use('/api/users', require('./api/user'));

  app.use('/auth', require('./auth'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
};
