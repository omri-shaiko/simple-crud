/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/models              ->  index
 * POST    /api/models              ->  create
 * GET     /api/models/:id          ->  show
 * PUT     /api/models/:id          ->  update
 * DELETE  /api/models/:id          ->  destroy
 */

'use strict';

const _ = require('lodash');


function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function (err) {
    res.status(statusCode).send(err);
  };
}

function responseWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function (entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function handleEntityNotFound(res) {
  return function (entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function saveUpdates(updates) {
  return function (entity) {
    var updated = _.merge(entity, updates);
    return updated.saveAsync()
      .spread(function (updated) {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function (entity) {
    if (entity) {
      return entity.removeAsync()
        .then(function () {
          res.status(204).end();
        });
    }
  };
}


module.exports = function (model) {
  const mongoose = require('bluebird').promisifyAll(require('mongoose'));
  const Schema = mongoose.Schema;
  const ObjSchema = new Schema(model.schema);
  const Model = mongoose.model(model.name, ObjSchema);

  return {
    // Gets a list of Model
    index: function (req, res) {
      Model.findAsync()
        .then(responseWithResult(res))
        .catch(handleError(res));
    },

    // Gets a single Model from the DB
    show: function (req, res) {
      Model.findByIdAsync(req.params.id)
        .then(handleEntityNotFound(res))
        .then(responseWithResult(res))
        .catch(handleError(res));
    },

    // Creates a new Model in the DB
    create: function (req, res) {
      Model.createAsync(req.body)
        .then(responseWithResult(res, 201))
        .catch(handleError(res));
    },

    // Updates an existing Model in the DB
    update: function (req, res) {
      if (req.body._id) {
        delete req.body._id;
      }
      Model.findByIdAsync(req.params.id)
        .then(handleEntityNotFound(res))
        .then(saveUpdates(req.body))
        .then(responseWithResult(res))
        .catch(handleError(res));
    },

    // Deletes a Model from the DB
    destroy: function (req, res) {
      Model.findByIdAsync(req.params.id)
        .then(handleEntityNotFound(res))
        .then(removeEntity(res))
        .catch(handleError(res));
    },
    Model
  }
};
