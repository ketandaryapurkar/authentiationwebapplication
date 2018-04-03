/**
 * Created by 212612730 on 7/2/2017.
 */

CabApp.controller('ForgotPassword',['$rootScope','$scope','cabFactory','$log','md5','$location','$timeout','toaster','$dialogs',

    function ($rootScope,$scope,cabFactory,$log,md5,$location,$timeout,toaster,$dialogs) {

        $rootScope.userUpdateData = [];
        $rootScope.loading = false;

        if($rootScope.sessionVar === 0 || isNaN($rootScope.sessionVar) || isNaN($rootScope.SSO)){
            //$dialogs.notify('Session expired',"Please login again.");
            $location.url('login');
        }

        $scope.changeClick = function (userSSO,pass,cpass) {


            if(userSSO !== null && pass !== null && cpass !== null) {

                if (pass === cpass) {
                    var hashpass = md5.createHash(pass);
                    $rootScope.loading = true;
                    $timeout( function(){


                    var promise = cabFactory.getUser(userSSO);
                    promise.then(function (success) {
                        $log.info(success);
                        var user = success.data;
                        if (user.hasOwnProperty('response')) {
                            //alert(user.response);
                            toaster.pop('success', "success", user.response);
                            $rootScope.loading = false;
                        }
                        else {
                            $rootScope.userUpdateData = {
                                "sso": user.sso,
                                "firstname" : user.firstname,
                                "lastname": user.lastname,
                                "contactNo": user.contactNo,
                                "password": hashpass,
                                "emailid":user.emailid
                            };
                            
                            var promise = cabFactory.updateUser(userSSO, $rootScope.userUpdateData);
                            promise.then(function (success) {
                                var check = success.data;
                                if (check.hasOwnProperty('response')) {
                                    //alert(check.response);
                                    //toaster.pop('success', "Success", check.response);
                                    $dialogs.notify('Success',check.response);
                                    $rootScope.loading = false;
                                    $timeout( function(){
                                        $location.url('home');
                                    }, 2000 );

                                }
                                else {
                                   // alert("Error");
                                    //toaster.pop('error', "Error", "Can't Change Your Password");
                                }
                            }, function (error) {
                                /*$rootScope.loading = false;
                                alert("No response from server please try later");*
                                toaster.pop('warning', "warning", error.data.response);*/
                                if(error.data != null) {
                                    if (error.data.hasOwnProperty('response')) {
                                        //toaster.pop('error', "Error", error.data.response);
                                        $dialogs.error(error.data.response);
                                        $rootScope.loading = false;
                                    }
                                }
                                else{
                                    $rootScope.loading = false;
                                    //toaster.pop('note', "Note", "No response from server please try later");
                                    $dialogs.notify('Something went wrong',"No response from server please try later");
                                }
                            });

                        }
                    }, function (error) {
                        /*$rootScope.loading = false;
                       /!* alert("No response from server please try later");*!/
                        toaster.pop('warning', "warning", error.data.response);*/
                        if(error.data != null) {
                            if (error.data.hasOwnProperty('response')) {
                                //toaster.pop('error', "Error", error.data.response);
                                $dialogs.error(error.data.response);
                                $rootScope.loading = false;
                            }
                        }
                        else{
                            $rootScope.loading = false;
                            //toaster.pop('note', "Note", "No response from server please try later");
                            $dialogs.notify('Something went wrong',"No response from server please try later");
                        }
                    });

                    }, 1000 );
                }
                else {
                    /*alert("Password Doesn't Match!!")*/
                    //toaster.pop('error', "Error", "Password Doesn't Match!!");
                    $dialogs.error("Password Doesn't Match!!");
                }
            }
            else{
               /* alert("Fill all details");*/
                 $dialogs.notify('Note','Please fill the details');
            }
        }

    }
]);