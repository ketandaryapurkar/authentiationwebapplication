/**
 * Created by 212629923 on 6/23/2017.
 */
CabApp.directive('numbersOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                    var transformedInput = text.replace(/[^0-9]/g, '');

                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                return undefined;
            }
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});

CabApp.directive('passwordVerify', function() {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function(scope, elem, attrs, ngModel) {
            scope.$watch(attrs.ngModel, function() {
                if (scope.confirm_password === scope.user_password) {
                    scope.pw.confirm_password.$setValidity('passwordVerify', true);
                    scope.pw.user_password.$setValidity('passwordVerify', true);
                } else if (scope.confirm_password !== scope.user_password) {
                    scope.pw.confirm_password.$setValidity('passwordVerify', false);
                    scope.pw.user_password.$setValidity('passwordVerify', false);
                }
            });
        }
    };
});/**
 * Created by 212612730 on 6/23/2017.
 */
