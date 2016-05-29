'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var ctrlStub = {
  index: 'controller.index',
  show: 'controller.show',
  create: 'controller.create',
  update: 'controller.update',
  destroy: 'controller.destroy'
};

var auth = {
  isAuthenticated: function() {
    return 'authService.isAuthenticated';
  },
  hasRole: function(role) {
    return 'authService.hasRole.' + role;
  }
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

var modelStub = {
  name: 'test',
  schema: {
    name: String,
    info: String,
    active: Boolean
  },
  routesMiddleware: {
    index: auth.isAuthenticated(),
    show: auth.isAuthenticated(),
    create: auth.isAuthenticated(),
    update: auth.isAuthenticated(),
    destroy: auth.hasRole('admin')
  },
  extendsRoutes: [
    {
      method: 'get',
      path: '/extends',
      middleware: auth.isAuthenticated(),
      controller: 'controller.extends'
    }
  ]
};

// require the index with our stubbed out modules
var generatorIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './controller': function () {
    return ctrlStub;
  }
})(modelStub);

describe('Model API Router:', function() {

  it('should return an express router instance', function() {
    expect(generatorIndex).to.equal(routerStub);
  });

  describe('GET /api/models', function() {
    it('should route to model.controller.index', function() {

      expect(routerStub.get
        .withArgs('/', 'authService.isAuthenticated', 'controller.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/models/extends-routes', function() {
    it('should route to model.controller.index', function() {

      expect(routerStub.get
        .withArgs('/extends', 'authService.isAuthenticated', 'controller.extends')
      ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/models/:id', function() {

    it('should route to model.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'authService.isAuthenticated', 'controller.show')
        ).to.have.been.calledOnce;
    });

  });

  describe('POST /api/models', function() {

    it('should route to model.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'authService.isAuthenticated', 'controller.create')
        ).to.have.been.calledOnce;
    });

  });

  describe('PUT /api/models/:id', function() {

    it('should route to model.controller.update', function() {
      expect(routerStub.put
        .withArgs('/:id', 'authService.isAuthenticated', 'controller.update')
        ).to.have.been.calledOnce;
    });

  });

  describe('PATCH /api/models/:id', function() {

    it('should route to model.controller.update', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'authService.isAuthenticated', 'controller.update')
        ).to.have.been.calledOnce;
    });

  });

  describe('DELETE /api/models/:id', function() {

    it('should route to model.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'authService.hasRole.admin', 'controller.destroy')
        ).to.have.been.calledOnce;
    });

  });

});
