require('debug').enable('mocha:*');
const { expect } = require('chai');
const app = require('../src/app');
const request = require('supertest')(app);

describe('GET /suggestions', () => {
  describe('with a non-existent city', () => {
    let response;

    before((done) => {
      request
        .get('/suggestions?q=SomeRandomCityInTheMiddleOfNowhere')
        .end((err, res) => {
          response = res;
          response.json = JSON.parse(res.text);
          done(err);
        });
    });

    it('returns a 404', () => {
      expect(response.statusCode).to.equal(404);
    });

    it('returns an empty array of suggestions', () => {
      expect(response.json.suggestions).to.be.instanceof(Array);
      expect(response.json.suggestions).to.have.length(0);
    });
  });

  describe('with a valid city', () => {
    let response;

    before((done) => {
      request
        .get('/suggestions?q=Montreal')
        .end((err, res) => {
          response = res;
          response.json = JSON.parse(res.text);
          done(err);
        });
    });

    it('returns a 200', () => {
      expect(response.statusCode).to.equal(200);
    });

    it('returns an array of suggestions', () => {
      expect(response.json.suggestions).to.be.instanceof(Array);
      expect(response.json.suggestions).to.have.length.above(0);
    });

    describe('Validate the shape of the data being returned', () => {
      it('contains latitudes and longitudes', () => {
        expect(response.json.suggestions).to.satisfy((suggestions) => suggestions.every((suggestion) => suggestion.latitude && suggestion.longitude));
      });

      it('contains scores', () => {
        expect(response.json.suggestions).to.satisfy((suggestions) => suggestions.every((suggestion) => suggestion.latitude && suggestion.longitude));
      });
    });

    it('contains a match', () => {
      expect(response.json.suggestions).to.satisfy((suggestions) => suggestions.some((suggestion) => /montreal/i.test(suggestion.name)));
    });
  });
}).end;
