/**
 * Created by 212612730 on 6/23/2017.
 */
CabApp.controller('MainController',MainFunction);

function MainFunction($rootScope,$scope,$location,$cookies,$dialogs) {


        $rootScope.sessionVar = 0;
        $rootScope.loggedinDate = 0;
        $scope.myCookieValue = $cookies.get('cookie');
        $rootScope.SSO = $scope.myCookieValue;
        var currentTime = new Date();
        currentTime.setMinutes(currentTime.getMinutes() + 10);
        
        $rootScope.setCookie = function (userSSO) {
            // $cookies.put('cookie', userSSO,{
            //     expires: currentTime
            // });
             $cookies.put('cookie', userSSO);
        }


        $scope.logoutClick = function () {
            var dlg = $dialogs.confirm('Are you sure you want to logout?');
            dlg.result.then(function(btn){
            $cookies.put('session',0);
            $cookies.remove('cookie');
            $rootScope.sessionVar = 0;
            $location.url('login');               
            },function(btn){

            });
           
        }
        
}

