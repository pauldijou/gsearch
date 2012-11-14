'use strict';

describe('Directive: favUser', function() {
  beforeEach(module('gsearchApp'));

  var element;

  it('should make hidden element visible', inject(function($rootScope, $compile) {
    element = angular.element('<fav-user></fav-user>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the favUser directive');
  }));
});
