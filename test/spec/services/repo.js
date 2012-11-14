'use strict';

describe('Service: repo', function () {

  // load the service's module
  beforeEach(module('gsearchApp'));

  // instantiate service
  var repo;
  beforeEach(inject(function(_repo_) {
    repo = _repo_;
  }));

  it('should do something', function () {
    expect(!!repo).toBe(true);
  });

});
