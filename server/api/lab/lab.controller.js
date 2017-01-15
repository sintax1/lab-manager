/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/labs              ->  index
 * POST    /api/labs              ->  create
 * GET     /api/labs/:id          ->  show
 * PUT     /api/labs/:id          ->  upsert
 * PATCH   /api/labs/:id          ->  patch
 * DELETE  /api/labs/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Lab from './lab.model';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function(entity) {
    try {
      jsonpatch.apply(entity, patches, /*validate*/ true);
    } catch(err) {
      return Promise.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function(entity) {
    if(entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if(!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Labs
export function index(req, res) {
  return Lab.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Lab from the DB
export function show(req, res) {
  return Lab.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Lab in the DB
export function create(req, res) {
  return Lab.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Lab in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Lab.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Lab in the DB
export function patch(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Lab.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Lab from the DB
export function destroy(req, res) {
  return Lab.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
