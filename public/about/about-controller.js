angular.module('blog')
    .controller('AboutCtrl', function($rootScope) {
        console.log('about');
        $rootScope.activeState = 3;
    });