'use strict';

angular.module('mean.controllers.login', [])
    .controller('LoginCtrl', ['$scope','$rootScope','$http','$location',
        function($scope, $rootScope, $http, $location) {
        // This object will be filled by the form
        $scope.user = {};

        // Register the login() function
        $scope.login = function(){
            $http.post('/login', {
                email: $scope.user.email,
                password: $scope.user.password
            })
                .success(function(user){
                    // authentication OK
                    $scope.loginError = 0;
                    $rootScope.user = user;
                    $rootScope.$emit('loggedin');
                    $location.url('/');
                })
                .error(function() {
                    $scope.loginerror = 'Authentication failed.';
                });
        };
    }])
    .controller('RegisterCtrl', ['$scope','$rootScope','$http','$location',
        function($scope, $rootScope, $http, $location) {
        // 将页面上的表单置空
        $scope.user = {};
        $scope.register = function(){
            // 去除报错信息
            $scope.usernameError = null;
            $scope.registerError = null;
            // 提交注册请求
            $http.post('/register', {
                username: $scope.user.username,
                email: $scope.user.email,
                password: $scope.user.password,
                confirmPassword: $scope.user.confirmPassword
            })
                .success(function(){
                    // 注册验证通过
                    // authentication OK
                    $scope.registerError = 0;
                    // 用户变量置入全局
                    $rootScope.user = $scope.user;
                    // 触发登录时间，后台静默登录
                    $rootScope.$emit('loggedin');
                    // 登录成功后跳转到首页
                    $location.url('/');
                })
                .error(function(error){
                    // 注册验证失败
                    // Error: authentication failed
                    if (error === 'Username already taken') {
                        $scope.usernameError = error;
                    } else if (error === 'Email already taken') {
                        $scope.emailError = error;
                    } else {
                        $scope.registerError = error;
                    }
                });
        };
    }]);
