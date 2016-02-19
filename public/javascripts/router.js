angular.module('blog')
    .controller('NavbarCtrl', function ($rootScope, $scope, $http) {
        console.log('works');

        $scope.isSignedin = false;
        $scope.username;
        $http.get('/auth')
            .then(function(res){
                if (res.data.auth) {
                    $scope.isSignedin = true;
                    console.log( res.data);
                    $scope.username = res.data.username;
                } else {
                    $scope.isSignedin = false;
                }
                // console.log(res);
            });
        $scope.isActive = function (n) {
            return $rootScope.activeState == n;
        };
        $scope.login = function (user) {
            console.log(user);
            console.log($scope.user);
            $http.put('/auth', user)
                .then(function (res) {
                    if (res.status == 200) {
                        $scope.isSignedin = true;
                        $scope.username = res.data.username;
                    } else if (res.status == 202) {
                        $scope.isSignedin = false;
                    }
                     
                    // console.log(res);
                }, function (err) {
                    console.log(err);
                });
        }

        $scope.getBtnText = function() {
            return $scope.isSignedin ? "Sign Out" : "Sign In"
        }
    })
    .config(function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise("/home");

        $stateProvider
            .state('home', {
                url: "/home",
                templateUrl: "home/home.html",
                controller: 'HomeCtrl'
            })
            .state('about', {
                url: "/about",
                templateUrl: "about/about.html",
                controller: 'AboutCtrl'
            })
            .state('project', {
                url: "/project",
                templateUrl: "project/project.html",
                controller: 'ProjectCtrl'
            })

    });