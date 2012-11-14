'use strict';

describe('Controller: RepoCtrl', function() {

  // load the controller's module
  beforeEach(module('gsearchApp'));

  var RepoCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller) {
    scope = {};
    RepoCtrl = $controller('RepoCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function() {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
