'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var labCtrlStub = {
  index: 'labCtrl.index',
  show: 'labCtrl.show',
  create: 'labCtrl.create',
  upsert: 'labCtrl.upsert',
  patch: 'labCtrl.patch',
  destroy: 'labCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var labIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './lab.controller': labCtrlStub
});

describe('Lab API Router:', function() {
  it('should return an express router instance', function() {
    expect(labIndex).to.equal(routerStub);
  });

  describe('GET /api/labs', function() {
    it('should route to lab.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'labCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/labs/:id', function() {
    it('should route to lab.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'labCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/labs', function() {
    it('should route to lab.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'labCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/labs/:id', function() {
    it('should route to lab.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'labCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/labs/:id', function() {
    it('should route to lab.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'labCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/labs/:id', function() {
    it('should route to lab.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'labCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
