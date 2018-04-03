/**
 * Created by 212612730 on 6/23/2017.
 */
CabApp.controller('RegisterController',['$scope','$location','cabFactory','$log','$rootScope','$timeout','md5','toaster','$dialogs',

function ($scope,$location,cabFactory,$log,$rootScope,$timeout,md5,toaster,$dialogs) {



        $rootScope.loading = false;
        $scope.var = '';
        $scope.fname = '';
        $scope.lname = '';
        $scope.cont = '';
        $scope.pass = '';
        $scope.cpass = '';
        $scope.email = '';
        $scope.passError = false;


        $scope.saveClicked = function (var1,fname,lname,mail,contact,pass1,cpass1) {


            if(var1 != null && fname != null && mail != null && lname != null && contact != null && pass1 != null && cpass1 != null){


                var hashpass = md5.createHash(pass1);
                if(pass1 === cpass1){
                    $rootScope.loading = true;
                    $scope.userData = {
                        "sso": var1,
                        "firstname" : fname,
                        "lastname": lname,
                        "contactNo": contact,
                        "password": hashpass,
                        "emailid":mail,
                        "applicationName":"cabApplication"
                    };
                    $timeout( function(){

                    var promise = cabFactory.putData($scope.userData);
                    promise.then(function(success){
                        var res = success.data;
                        $rootScope.loading = false;
                        //alert(res.response);
                        //toaster.pop('success', "Success", res.response);
                        $dialogs.notify('Success',res.response);
                        $log.info(success);
                    },function (error) {
                        //alert("Registrartion falied please try again!!");
                        if(error.data != null) {
                            if (error.data.hasOwnProperty('response')) {
                                //toaster.pop('error', "Error", error.data.response);
                                $dialogs.error(error.data.response);
                                $rootScope.loading = false;
                            }
                            else{
                                //toaster.pop('error', "Error", error.data.error);
                            }
                        }
                        else{
                            $rootScope.loading = false;
                            //toaster.pop('note', "Note", "No response from server please try later");
                            $dialogs.notify('Something went wrong',"No response from server please try later");
                        }
                    });

                    $location.url('/login');

                    }, 1000 );
                }
                else{
                    $dialogs.error("Password Doesn't Match!!");
                    $scope.passError = true;
                    $scope.cpass = '';
                }
            }
            else{
                //alert("Enter all details");
                //toaster.pop('warning', "Warning", "Enter all details");
                $dialogs.notify('Note','Please fill the details');
            }
        }
        $scope.cancelClicked = function () {
            $location.url('/login');
        }
}]);