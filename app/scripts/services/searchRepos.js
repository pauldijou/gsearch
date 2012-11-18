'use strict';

gsearchApp.factory('searchRepos', ['$resource', function($resource) {
    return $resource('https://api.github.com/legacy/repos/search/:keyword', {}, {
        'query' : {
            method : 'GET',
            isArray : false
        }
    });
}]);