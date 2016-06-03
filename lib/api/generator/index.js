'use strict';

module.exports = function(model){
  const express = require('express');
  const router = express.Router();
  const controller = require('./controller')(model);

  model.routesMiddleware = model.routesMiddleware || {};
  model.extendsRoutes = model.extendsRoutes || [];

  model.extendsRoutes.forEach(function (item) {
    router[item.method](item.path, item.middleware || noopMiddleware, attachModel, item.controller);
  });

  router.get('/', model.routesMiddleware['index'] || noopMiddleware, controller.index);
  router.get('/:id', model.routesMiddleware['show'] || noopMiddleware, controller.show);
  router.post('/', model.routesMiddleware['create'] || noopMiddleware, controller.create);
  router.put('/:id', model.routesMiddleware['update'] || noopMiddleware, controller.update);
  router.patch('/:id', model.routesMiddleware['update'] || noopMiddleware, controller.update);
  router.delete('/:id', model.routesMiddleware['destroy'] || noopMiddleware, controller.destroy);

  return router;

  function noopMiddleware(req, res, next){
    next();
  }
  function attachModel(req, res, next){
    req.Model = controller.Model;
    next();
  }
};

