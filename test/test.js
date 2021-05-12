const expect = require('chai').expect;
const server = require('../server');
const request = require('supertest');

describe('Our server', function() {
    // Called once before any of the tests in this block begin.
    before(function(done) {
      server.app.listen(8000, function(err) {
        if (err) { return done(err); }
        done();
      });
    });
  
    it('should send back a JSON object with all the comics', function(done) {
      request(server.app)
        .get('/comics')
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, function(err, res) {
          if (err) { return done(err); }
          console.log(res.body);
          resultBody = res.body[0].comic_id;
          expect(resultBody).to.equal(8); //check chai api to know what to use
          done();
        });
    });
  
});
  