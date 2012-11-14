'use strict';

describe('Service: searchUsers', function () {

  // load the service's module
  beforeEach(module('gsearchApp'));

  // instantiate service
  var searchUsers;
  beforeEach(inject(function(_searchUsers_) {
    searchUsers = _searchUsers_;
  }));

  it('should do something', function () {
    expect(!!searchUsers).toBe(true);
  });

});
