/**
 * Created by 212612730 on 6/21/2017.
 */
var CabApp = angular.module("CabApp", ['ngRoute','ngCookies','angular-md5','toaster','ui.bootstrap','dialogs']);



CabApp.config(['$routeProvider',

    function ($routeProvider) {
        $routeProvider.when('/home',{controller:'CabController', templateUrl:'html/home.html'});
        $routeProvider.when('/login',{controller:'LoginController', templateUrl:'html/login.html'});
        $routeProvider.when('/forgotPassword',{controller:'ForgotPassword', templateUrl:'html/forgotPassword.html'});
        $routeProvider.when('/newRegisteration',{controller:'RegisterController', templateUrl:'html/newRegisteration.html'});
        $routeProvider.when('/error',{controller:'RegisterController', templateUrl:'html/error.html'});
        $routeProvider.otherwise({redirectTo:'/login'});
    }
]);



CabApp.config(['$httpProvider',
    function ($httpProvider) {
        $httpProvider.defaults.timeout = 5000;
}]);

CabApp.run(function($window) {
    var windowElement = angular.element($window);

    /*if($location.path() == '/home'){
     //alert("dont do it");
     var promise = cabFactory.checkBooking($rootScope.SSO);
     promise.then(function (success) {
     $log.info(success);
     $rootScope.alreadyBook = success.data;
     console.log(success.data);
     }, function (error) {
     console.log(error.data);
     });
     }*/
    //  windowElement.onbeforeunload = function(event){
    //      event.returnValue = "You will be logged out!!";
    //      console.log(event);
    //     console.log(hi);
    //  };
    // windowElement.on('beforeunload', function (event) {
    //  // do whatever you want in here before the page unloads.
    //  event.returnValue = "You will be logged out!!";
    //  // the following line of code will prevent reload or navigating away.
    //  event.preventDefault();
    //  });
});
