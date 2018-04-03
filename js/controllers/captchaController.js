/**
 * Created by 212612730 on 7/13/2017.
 */
CabApp.controller('captchaController', ['$scope', '$modalInstance', 'cabFactory', '$http', '$base64', '$rootScope',
    function ($scope, $modalInstance, cabFactory, $http, $base64, $rootScope) {
        $scope.captcha = '';
        $scope.error = '';
        $scope.userAvatar = function () {
            var promise = cabFactory.getAvatar($rootScope.SSO);
            promise.then(function (success) {

                $scope.captcha = success.data;
                console.log($scope.captcha);
            });
        };
        $scope.userAvatar();
        $scope.refreshCaptcha = function () {
            $scope.userAvatar();
        }

        $scope.confirm = function (code) {
           console.log(code);
            $scope.captchaCode = code;
            $modalInstance.close($scope.captchaCode);
        }

        $scope.close = function () {
            $modalInstance.close("closed");
        }
    }]);
