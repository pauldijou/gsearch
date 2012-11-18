'use strict';

gsearchApp.factory('searchUsers', ['$resource', function($resource) {
    return $resource('https://api.github.com/legacy/user/search/:keyword', {}, {
        'query' : {
            method : 'GET',
            isArray : false
        }
    });
}]);
