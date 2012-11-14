'use strict';

describe('Directive: booleanIcon', function() {
  beforeEach(module('gsearchApp'));

  var element;

  it('should make hidden element visible', inject(function($rootScope, $compile) {
    element = angular.element('<boolean-icon></boolean-icon>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the booleanIcon directive');
  }));
});
