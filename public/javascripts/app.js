angular.module('blog', ['ui.router', 'ui.bootstrap'])
    .controller('HomeCtrl', function($rootScope) {
        //console.log('works');
        $rootScope.activeState = 1;
    });
    
