const supertest = require('supertest');
const app = require('../app');
const {expect} = require('chai');

describe('GET /apps', () => {
    it('should return an array of apps', () => {
        return supertest(app)
        .get('/apps')
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
            expect(res.body).to.be.an('array');
            expect(res.body).to.have.lengthOf.at.least(1);
            const book = res.body[0];
            expect(book).to.include.all.keys('App', 'Rating', 'Price', 'Genres');
        })
    })
    it('should be 400 if sort is incorrect', () => {
        return supertest(app)
        .get('/apps')
        .query({sort: 'MISTAKE'})
        .expect(400, 'Sort must be one of rating or app')
    })
    it('should be 400 if genre is incorreect', () => {
        return supertest(app)
        .get('/apps')
        .query({genres: 'Mistake'})
        .expect(400, 'Genres must be one of Action, Puzzle, Strategy, Casual, Arcade, or Card')
    })
    it('should sort by rating', () => {
        return supertest(app)
        .get('/apps')
        .query({sort: 'rating'})
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
            let sorted = true;
            let i = 0;
            while (i < res.body.length - 1) {
                const appAtI = res.body[i];
                const appAtIPlus1 = res.body[i + 1];
                if (appAtI.rating < appAtIPlus1.rating) {
                    sorted = false;
                    break;
                }
                i++;
            }
            expect(sorted).to.be.true;
        })
    })
})