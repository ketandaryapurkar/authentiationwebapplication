/**
 * Created by 212612730 on 6/23/2017.
 */

CabApp.factory('cabFactory',['$http', '$q', '$rootScope','ENV','toaster',
    function ($http,$q,$rootScope,ENV,toaster) {
        var factory = {};

        factory.getCab = function(){
            return $q(function(resolve, reject) {
                $http.get(ENV.ApiEndpoint +'getCabSchedule').then(function (data) {
                    resolve(data);
                }, function (error) {
                    reject(error);
                })
            });

        };

        factory.getBoardingPoint = function(location){
            return $q(function(resolve, reject) {
                $http.get(ENV.ApiEndpoint +'getBoardingPoint/'+location).then(function (data) {
                    resolve(data);
                }, function (error) {
                    reject(error);
                })
            });

        };

        factory.getAllBoardingPoint = function(){
            return $q(function(resolve, reject) {
                $http.get(ENV.ApiEndpoint +'boardingpoints').then(function (data) {
                    resolve(data);
                }, function (error) {
                    reject(error);
                })
            });

        };

        factory.checkBooking = function(sso){
            return $q(function(resolve, reject) {
                $http.get(ENV.ApiEndpoint +'getFutureBookingBySso/'+sso).then(function (data) {
                    resolve(data);
                }, function (error) {
                    reject(error);
                })
            });

        };

        factory.getCabSeats = function(cid){
            return $q(function(resolve, reject) {
                $http.get(ENV.ApiEndpoint +'getAvailableSeats/'+cid).then(function (data) {
                    resolve(data);
                }, function (error) {
                    reject(error);
                })
            });

        };



        factory.login = function(loginData){
            return $q(function(resolve, reject) {
                var config = {
                    headers: {
                        'Content-Type' : 'application/json;charset=utf-8;',
                        'Access-Control-Allow-Origin': '*'
                    }
                }
                $http.post(ENV.ApiEndpoint +'login', loginData).then(function (data) {
                    resolve(data);
                }, function (error) {
                    reject(error);
                })
            });

        };

        factory.putData = function (userdata) {
            return $q(function(resolve, reject) {

                var config = {
                    headers: {
                        'Content-Type' : 'application/json;charset=utf-8;',
                        'Access-Control-Allow-Origin': '*'
                    }
                }
                $http.post(ENV.ApiEndpoint +'users',userdata).then(function (data) {
                    resolve(data);
                }, function (error) {
                    reject(error);
                })
            });
        }



        factory.bookingData = function (bookdata,text) {
            return $q(function(resolve, reject) {

                var config = {
                    headers: {
                        'Content-Type' : 'application/json;charset=utf-8;',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS'
                    }
                }

                $http.post(ENV.ApiEndpoint +'bookseat/'+text,bookdata).then(function (data) {
                   
                    resolve(data);
                }, function (error) {
                    
                    //alert("Booking Unsuccessfull");
                    reject(error);
                })
            });
        }


        factory.cancelbooking = function (sso,cancelDest) {
            return $q(function(resolve, reject) {

                var config = {
                    headers: {
                        'Content-Type' : 'application/json;charset=utf-8;'
                    }
                }
                $http.delete(ENV.ApiEndpoint +'deletebooking/'+ sso+'/'+cancelDest).then(function (data) {
                    
                    resolve(data);
                }, function (error) {
                    
                    reject(error);
                })
            });
        }

        factory.updateUser = function (sso,userdata) {
            return $q(function(resolve, reject) {

                var config = {
                    headers: {
                        'Content-Type' : 'application/json;charset=utf-8;',
                        'Access-Control-Allow-Origin': '*'
                    }
                }
                $http.put(ENV.ApiEndpoint +'updateUser',userdata).then(function (data) {
                    resolve(data);
                }, function (error) {
                    reject(error);
                })
            });
        }

        factory.getUser = function(sso) {
            return $q(function (resolve, reject) {
                $http.get(ENV.ApiEndpoint + 'getSingleUser/' + sso+"/cabApplication").then(function (data) {
                    resolve(data);
                }, function (error) {
                    reject(error);
                })
            });
        }

        factory.getAvatar = function(sso) {
            return $q(function(resolve, reject) {
                $http.get(ENV.ApiEndpoint +'retrieveCaptchaForUser/'+sso).then(function (data) {
                    resolve(data);
                }, function (error) {
                    reject(error);
                })
            });
        }

        factory.getCabDetails = function(cabScheduleId) {
            return $q(function (resolve, reject) {
                $http.get(ENV.ApiEndpoint + 'findBookingByCabScheduleId/' + cabScheduleId).then(function (data) {
                    resolve(data);
                }, function (error) {
                    reject(error);
                })
            });
        }

        // factory.getCaptcha = function() {
        //     return $q(function (resolve, reject) {
        //         $http.get(ENV.ApiEndpoint + 'getCaptcha').then(function (data) {
        //             resolve(data);
        //         }, function (error) {
        //             reject(error);
        //         })
        //     });
        // }

        return factory;
    }]);


