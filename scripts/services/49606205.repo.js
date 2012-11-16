'use strict';

gsearchApp.factory('repo', ['$resource', function($resource) {
    return $resource('https://api.github.com/repos/:owner/:name/:param1', {}, {
        'commits' : {
            method : 'GET',
            params: {param1: 'commits', per_page: 100},
            isArray : true
        }
    });
}]);
