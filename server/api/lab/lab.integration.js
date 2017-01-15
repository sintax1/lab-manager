'use strict';

var app = require('../..');
import request from 'supertest';

var newLab;

describe('Lab API:', function() {
  describe('GET /api/labs', function() {
    var labs;

    beforeEach(function(done) {
      request(app)
        .get('/api/labs')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          labs = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(labs).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/labs', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/labs')
        .send({
          name: 'New Lab',
          info: 'This is the brand new lab!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newLab = res.body;
          done();
        });
    });

    it('should respond with the newly created lab', function() {
      expect(newLab.name).to.equal('New Lab');
      expect(newLab.info).to.equal('This is the brand new lab!!!');
    });
  });

  describe('GET /api/labs/:id', function() {
    var lab;

    beforeEach(function(done) {
      request(app)
        .get(`/api/labs/${newLab._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          lab = res.body;
          done();
        });
    });

    afterEach(function() {
      lab = {};
    });

    it('should respond with the requested lab', function() {
      expect(lab.name).to.equal('New Lab');
      expect(lab.info).to.equal('This is the brand new lab!!!');
    });
  });

  describe('PUT /api/labs/:id', function() {
    var updatedLab;

    beforeEach(function(done) {
      request(app)
        .put(`/api/labs/${newLab._id}`)
        .send({
          name: 'Updated Lab',
          info: 'This is the updated lab!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedLab = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedLab = {};
    });

    it('should respond with the updated lab', function() {
      expect(updatedLab.name).to.equal('Updated Lab');
      expect(updatedLab.info).to.equal('This is the updated lab!!!');
    });

    it('should respond with the updated lab on a subsequent GET', function(done) {
      request(app)
        .get(`/api/labs/${newLab._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let lab = res.body;

          expect(lab.name).to.equal('Updated Lab');
          expect(lab.info).to.equal('This is the updated lab!!!');

          done();
        });
    });
  });

  describe('PATCH /api/labs/:id', function() {
    var patchedLab;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/labs/${newLab._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Lab' },
          { op: 'replace', path: '/info', value: 'This is the patched lab!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedLab = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedLab = {};
    });

    it('should respond with the patched lab', function() {
      expect(patchedLab.name).to.equal('Patched Lab');
      expect(patchedLab.info).to.equal('This is the patched lab!!!');
    });
  });

  describe('DELETE /api/labs/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/labs/${newLab._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when lab does not exist', function(done) {
      request(app)
        .delete(`/api/labs/${newLab._id}`)
        .expect(404)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });
  });
});
