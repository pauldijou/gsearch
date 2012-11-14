'use strict';

describe('Directive: tab', function() {
  beforeEach(module('gsearchApp'));

  var element;

  it('should make hidden element visible', inject(function($rootScope, $compile) {
    element = angular.element('<tab></tab>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the tab directive');
  }));
});
