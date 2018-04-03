/**
 * Created by 212612730 on 6/22/2017.
 */

CabApp.controller("LoginController", ['$rootScope', '$scope', '$location', 'cabFactory', '$log', '$cookies', '$timeout', 'md5', 'toaster', '$dialogs',

    function ($rootScope, $scope, $location, cabFactory, $log, $cookies, $timeout, md5, toaster, $dialogs) {

        $scope.init = function () {
            $rootScope.loginbtn = false;
            $rootScope.adminlogin = false;
            $rootScope.userlogin = false;
            $scope.pass = '';
            $scope.wrong = false;

            if ($rootScope.sessionVar === 1 && !isNaN($rootScope.SSO)) {
                // $rootScope.sessionVar = 0;

                $rootScope.loading = true;
                var dlg = $dialogs.confirm('You will be logged out!!!');
                dlg.result.then(function (btn) {
                    $rootScope.sessionVar = 0;
                    $rootScope.loading = false;
                }, function (btn) {
                    var check = $cookies.get('entity');
                    if (check === "admin") {
                        $rootScope.adminlogin = true;
                    }
                    else if (check === "user") {
                        $rootScope.userlogin = true;
                    }
                    $rootScope.loading = false;
                    $location.url('home');
                });

            }
            
            $scope.loginClick = function (userSSO, pass) {

                var hashpass = md5.createHash(pass);
                if (userSSO !== null && pass !== null && pass !== '') {
                    $rootScope.loading = true;
                    $rootScope.SSO = userSSO;

                    var loginData = {
                        "sso": userSSO,
                        "password": hashpass,
                        "applicationaName":"cabApplication"
                    };

                    var promise = cabFactory.login(loginData);
                    promise.then(function (success) {

                        var check = success.data;

                        if (check.response === "success") {
                            if (check.entity === "admin") {
                                $rootScope.adminlogin = true;
                            }
                            else if (check.entity === "user") {
                                $rootScope.userlogin = true;
                            }
                            var currentTime = new Date();
                            currentTime.setMinutes(currentTime.getMinutes() + 10);
                            $cookies.put('entity', check.entity);
                            $cookies.put('session', 1);
                            $rootScope.loading = false;
                            $rootScope.sessionVar = 1;
                            $location.url('home');
                            $rootScope.setCookie(userSSO);

                        }
                        else {
                            $rootScope.loading = false;
                            //alert(check.response);
                            /*toaster.pop('note', "Note", check.response);*/
                            $dialogs.notify('Note', check.response);
                            //$rootScope.popErrorLogin(check.response);
                        }
                    }, function (error) {
                        /*$rootScope.loading = false;
                        //alert("No response from server please try later");
                        toaster.pop('note', "note", "No response from server please try later");*/
                        if (error.data !== null) {
                            if (error.data.hasOwnProperty('response')) {
                                /*toaster.pop('error', "Error", error.data.response);*/
                                $dialogs.error(error.data.response);
                                $rootScope.loading = false;
                            }
                            else {
                                /*toaster.pop('error', "Error", error.data.error);*/
                                //$dialogs.error(error.data.response);
                            }
                        }
                        else {
                            $rootScope.loading = false;
                            /*toaster.pop('note', "Note", "No response from server please try later");*/
                            $dialogs.notify('Something went wrong', "No response from server please try later");
                        }
                    });
                }
                else {
                    //alert("Please fill the details");
                    //toaster.pop('warning', "Warning", "Please fill the details");
                    $dialogs.notify('Note', 'Please fill the details');
                }

            }

            $scope.signIn = function () {
                $rootScope.loading = false;
                $location.url('newRegisteration');
            }

        }
        $scope.init();

    }]);