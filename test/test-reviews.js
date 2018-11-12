const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const should = chai.should();
const Review = require('../models/review');

const sampleReview = {
  "title": "Super Sweet Review",
  "movie-title": "La La Land",
  "description": "A great review of a lovely movie."
};

chai.use(chaiHttp);

// tells mocha you want to test Reviews (this string is taco)
describe('Reviews', () => {

  after(() => {
    Review.deleteMany({title: 'Super Sweet Review'}).exec((err, reviews) => {
      console.log(reviews)
      reviews.remove();
    })
  });

  // TEST INDEX
  it('should index ALL reviews on /GET', (done) => { //make taco name for the test
    chai.request(server) //use chai-http to make a request to your server
      .get('/') //send a GET request to root route
      .end((err, res) => { //wait for response
        res.should.have.status(200); //check that the response status is = 200 (success)
        res.should.be.html; //check that the response is a type html
        done(); //end this test, go to the next
      });
  });

  // TEST NEW
  it('should display new form on /reviews/new GET', (done) => {
    chai.request(server)
      .get(`/reviews/new`)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.html
          done();
        });
  });

  // TEST CREATE
  it('should create a SINGLE review on /reviews POST', (done) => {
    chai.request(server)
      .post('/reviews')
      .send(sampleReview)
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.html
        done();
      });
  });

  // TEST SHOW
  it('should show a SINGLE review on /reviews/<id> GET', (done) => {
    var review = new Review(sampleReview);
    review.save((err, data) => {
      chai.request(server)
        .get(`/reviews/${data._id}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.html
          done();
        });
    });
  });

  // TEST EDIT
  it('should edit a SINGLE review on /reviews/<id>/edit GET', (done) => {
    var review = new Review(sampleReview);
      review.save((err, data) => {
        chai.request(server)
          .get(`/reviews/${data._id}/edit`)
          .end((err, res) => {
            res.should.have.status(200);
            res.should.be.html
            done();
          });
      });
  });

  // TEST UPDATE
  it('should update a SINGLE review on /reviews/<id> PUT', (done) => {
    var review = new Review(sampleReview);
    review.save((err, data) => {
      chai.request(server)
        .put(`/reviews/${data._id}?_method=PUT`)
        .send({'title': 'Updating the title'})
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.html
          done();
        });
    });
  });

  // TEST DELETE
  it('should delete a SINGLE review on /reviews/<id> DELETE', (done) => {
    var review = new Review(sampleReview);
    review.save((err, data) => {
      chai.request(server)
        .delete(`/reviews/${data._id}?_method=DELETE`)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.html
          done();
        });
    });
  });
});
