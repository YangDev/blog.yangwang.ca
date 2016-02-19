var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var should = chai.should();

chai.use(chaiHttp);

describe('auth', function() {
    it('shoud signup user on /auth POST');
    it('shoud signin user on /auth PUT');
    it('shoud signout user on /auth PUT if user is already signin');
});