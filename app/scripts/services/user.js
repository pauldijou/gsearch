'use strict';

gsearchApp.factory('user', function($resource) {
    return $resource('https://api.github.com/users/:login/:param1', {}, {
        'repos' : {
            method : 'GET',
            params: {param1: 'repos'},
            isArray : true
        }
    });
});