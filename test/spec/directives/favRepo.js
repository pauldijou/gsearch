'use strict';

describe('Directive: favRepo', function() {
  beforeEach(module('gsearchApp'));

  var element;

  it('should make hidden element visible', inject(function($rootScope, $compile) {
    element = angular.element('<fav-repo></fav-repo>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the favRepo directive');
  }));
});
