'use strict';

gsearchApp.factory('user', function($resource) {
    return $resource('https://api.github.com/users/:username', {}, {
        
    });
});