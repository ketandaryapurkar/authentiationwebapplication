/**
 * Created by 212612730 on 6/22/2017.
 */

CabApp.controller("CabController", ['$scope', '$location', '$rootScope', 'cabFactory', '$log', '$cookies', '$timeout', 'ENV', 'toaster', '$dialogs', '$http',
    function ($scope, $location, $rootScope, cabFactory, $log, $cookies, $timeout, ENV, toaster, $dialogs, $http) {


        $scope.init = function () {
            $scope.cabCheckedTime = '';
            $scope.fetched = false;
            $rootScope.cabId = '';
            $scope.checkCabDetails = false;
            $rootScope.loading = true;
            $scope.indexToCompany = -1;
            $scope.indexFromCompany = -1;
            $scope.TabToCompany = 0;
            $scope.routes = [];
            $scope.routeToCompany = [];
            $scope.timing = [];
            $scope.timingF = [];
            $scope.Seats = [];
            $rootScope.loginbtn = true;
            $scope.pick = null;
            $scope.routeName = 'Source';
            $scope.routeSelected = '';
            $scope.cabTime = [];
            $scope.boardingPT = [];
            $scope.cabBookData = [];
            $rootScope.alreadyBook = [];
            $scope.bookedToCompany = 0;
            $scope.bookedFromCompany = 0;
            $scope.destTOCancel = '';
            $scope.toCompanySelected = 1;
            $scope.toggleRoute = false;
            $scope.filler = true;
            $scope.boardingPtSelected = '';
            $scope.allBoardingPT = [];
            $scope.PickSourceTo = '';
            $scope.PickSourceFrom = '';
            $scope.PickTimeTo = '';
            $scope.PickTimeFrom = '';
            $scope.cabBookingData = [];
            $scope.timeSelect = '';
            $scope.CabNo = '';
            $scope.VehicleType = '';
            $scope.DriverName = '';
            $scope.DriverContactNo = '';
            $scope.cabdetails = [];
            $scope.empSSO = '';
            $scope.empName = '';
            $scope.book = false;
            $scope.cancelBook = false;
            $checkPick = true;
            $scope.cabCancelIDTo = '';
            $scope.cabCancelIDFrom = '';
            $rootScope.bookDetailsTo = [];
            $rootScope.bookDetailsFrom = [];
            $scope.currentTo = 0;
            $scope.currentFrom = 0;
            $scope.NoBooking = false;
            $scope.PickUpLocation = '';
            $scope.Captcha = 0;
            $scope.captchaCode = "";
            $rootScope.sessionVar = parseInt($cookies.get('session'));

            if ($rootScope.sessionVar === 0 || isNaN($rootScope.sessionVar) || isNaN($rootScope.SSO)) {
                $dialogs.notify('Session expired', "Please login again.");
                $location.url('login');
            }

            /*var currentTime = new Date();
            var currentOffset = currentTime.getTimezoneOffset();
            var ISTOffset = 330;   // IST offset UTC +5:30 
            var ISTTime = new Date(currentTime.getTime() + (ISTOffset + currentOffset)*60000);
                        // ISTTime now represents the time in IST coordinates
            var hoursIST = parseInt(ISTTime.getHours());
            var minutesIST = parseInt(ISTTime.getMinutes());
            var date = hoursIST*60 + minutesIST;
            $rootScope.turnOffSession(date);*/

            var check = $cookies.get('entity');
            if (check === "admin") {
                $rootScope.adminlogin = true;
                $rootScope.userlogin = false;
            }
            else if (check === "user") {
                $rootScope.userlogin = true;
                $rootScope.adminlogin = false;
            }

            // var x = Math.floor(Math.random() * 900000) + 100000;
            // $scope.Captcha = x;

            // $scope.refreshCaptcha = function () {
            //     var x = Math.floor(Math.random() * 900000) + 100000;
            //     $scope.Captcha = x;
            // }

            $scope.PickSource1 = ENV.Source1;
            $scope.PickSource2 = ENV.Source2;
            var promise = cabFactory.checkBooking($rootScope.SSO);
            promise.then(function (success) {
                $log.info(success);
                $rootScope.alreadyBook = success.data;
                if ($rootScope.alreadyBook.length > 0) {
                    if ($scope.TabToCompany === 1) {
                        $scope.cabCancelIDTo = $rootScope.alreadyBook[0].cabSchedule.cabScheduleId;
                    }
                    else {
                        $scope.cabCancelIDFrom = $rootScope.alreadyBook[1].cabSchedule.cabScheduleId;
                    }
                }
            }, function (error) {
                $rootScope.loading = false;
                $scope.checkDetails = false;
                if (error.data != null) {
                    if (error.data.hasOwnProperty('response')) {
                        //toaster.pop('error', "Error", error.data.response);
                        $dialogs.error(error.data.response);
                    }
                    else {
                        //toaster.pop('error', "Error", error.data.error);
                    }
                }
                else {
                    $rootScope.loading = false;
                    //toaster.pop('note', "Note", "No response from server please try later");
                    $dialogs.notify('Something went wrong', "No response from server please try later");
                }

            });



            $timeout(function () {

                var promise = cabFactory.getCab();
                promise.then(function (success) {

                    $scope.cabBookingData = success.data;
                    $rootScope.cabId = $scope.cabBookingData.cabScheduleId;
                    $log.info(success);
                    $rootScope.loading = false;
                    var cabData = $scope.cabBookingData;
                    for (var i = 0; i < cabData.length; i++) {
                        if (cabData[i].hasOwnProperty('destination')) {
                            var singleCabDetails = {
                                "cabID": cabData[i].cabScheduleId,
                                "dest": cabData[i].destination,
                                "time": cabData[i].time
                            }
                            if (!(cabData[i].destination === ENV.Source))
                                $scope.routes.push(singleCabDetails);
                        }


                        if (cabData[i].hasOwnProperty('source')) {
                            var singleCabDetails = {
                                "cabID": cabData[i].cabScheduleId,
                                "dest": cabData[i].source,
                                "time": cabData[i].time
                            }
                            if (!(cabData[i].source === ENV.Source))
                                $scope.routeToCompany.push(singleCabDetails);
                        }

                        if (cabData[i].hasOwnProperty('time')) {
                            var singleCabDetails = {
                                "cabID": cabData[i].cabScheduleId,
                                "time": cabData[i].time
                            }
                            $scope.timing.push(singleCabDetails);
                        }

                        if (cabData[i].hasOwnProperty('availableSeats')) {
                            var singleCabDetails = {
                                "cabID": cabData[i].cabScheduleId,
                                "seat": cabData[i].availableSeats
                            }
                            $scope.Seats.push(singleCabDetails);
                        }

                        if (cabData[i].hasOwnProperty('cab')) {
                            var singleCabDetails = {
                                "cabID": cabData[i].cabScheduleId,
                                "cabNo": cabData[i].cab.cabNo,
                                "vehicleType": cabData[i].cab.vehicleType,
                                "driverName": cabData[i].cab.driverName,
                                "driverContactNo": cabData[i].cab.driverContactNo
                            }
                            $scope.cabBookData.push(singleCabDetails);
                        }
                    }
                    $scope.routes.sort(function (a, b) { return (a.time > b.time) ? 1 : ((b.time > a.time) ? -1 : 0); });
                    $scope.routeToCompany.sort(function (a, b) { return (a.time > b.time) ? 1 : ((b.time > a.time) ? -1 : 0); });
                    $scope.timing.sort(function (a, b) { return (a.time > b.time) ? 1 : ((b.time > a.time) ? -1 : 0); });
                    if ($scope.routeToCompany.length > 0) {
                        fillBoardingPoint($scope.routeToCompany[0].dest);
                    }

                    if ($rootScope.alreadyBook.length != 0) {
                        for (var i = 0; i < $rootScope.alreadyBook.length; i++) {
                            if ($rootScope.alreadyBook[i].cabSchedule.destination === ENV.Source) {
                                $scope.bookedToCompany = 1;
                                $scope.indexToCompany = i;
                            }
                            if ($rootScope.alreadyBook[i].cabSchedule.source === ENV.Source) {
                                $scope.bookedFromCompany = 1;
                                $scope.indexFromCompany = i;
                            }
                        }

                        fillbookingToCompany($scope.bookedToCompany, $scope.indexToCompany);
                        fillbookingFromCompany($scope.bookedFromCompany, $scope.indexFromCompany);

                    }

                    function fillBoardingPoint(location) {
                        var promise = cabFactory.getBoardingPoint(location);
                        promise.then(function (success) {
                            $log.info(success);
                            $scope.boardingPT = success.data;
                            if ($scope.boardingPT.length > 0) {
                                $scope.boardingPtSelected = $scope.boardingPT[0].boardingPtId;
                            }
                            else {
                                $scope.boardingPtSelected = '';
                            }
                        }, function (error) {
                        });
                    }

                    function fillbookingToCompany(check, i) {
                        if (check === 1 && i > -1) {
                            $scope.filler = false;
                            $checkPick = false;
                            $scope.checkDetails = true;
                            $scope.isBookDisabled = true;
                            $scope.CabNo = $rootScope.alreadyBook[i].cabSchedule.cab.cabNo;
                            $scope.VehicleType = $rootScope.alreadyBook[i].cabSchedule.cab.vehicleType;
                            $scope.DriverName = $rootScope.alreadyBook[i].cabSchedule.cab.driverName;
                            $scope.DriverContactNo = $rootScope.alreadyBook[i].cabSchedule.cab.driverContactNo;

                            $scope.destinationSelected = 'Source: ' + $rootScope.alreadyBook[i].boardingPt;

                            var timeofcab = $rootScope.alreadyBook[i].cabSchedule.time.substr(0, 5);
                            var check = parseInt($rootScope.alreadyBook[i].cabSchedule.time.substr(0, 2));
                            var half = $rootScope.alreadyBook[i].cabSchedule.time.substr(2, 3);
                            if (check < 12 && check > 0) {

                                timeofcab += ' AM';
                            }
                            else if (check === 12) {
                                timeofcab += ' PM';
                            }
                            else if (check === 0) {
                                check += 12;
                                timeofcab = check.toString() + half + ' AM';
                            }
                            else {
                                check -= 12;
                                if (check < 10) {
                                    timeofcab = '0' + check.toString() + half + ' PM';
                                }
                                else {
                                    timeofcab = check.toString() + half + ' PM';
                                }
                            }
                            $scope.timeOfCab = timeofcab;
                        }
                        else if (check === 1) {
                            $scope.filler = false;
                            $checkPick = false;
                            $scope.checkDetails = true;
                            $scope.isBookDisabled = true;
                        }
                        else {
                            $scope.filler = true;
                            $checkPick = false;
                            $scope.checkDetails = false;
                            $scope.isBookDisabled = false;
                        }
                    }

                    function fillbookingFromCompany(check, i) {
                        if (check === 1 && i > -1) {
                            $scope.filler = false;
                            $scope.checkDetails = true;
                            $scope.isBookDisabled = true;
                            $scope.CabNo = $rootScope.alreadyBook[i].cabSchedule.cab.cabNo;
                            $scope.VehicleType = $rootScope.alreadyBook[i].cabSchedule.cab.vehicleType;
                            $scope.DriverName = $rootScope.alreadyBook[i].cabSchedule.cab.driverName;
                            $scope.DriverContactNo = $rootScope.alreadyBook[i].cabSchedule.cab.driverContactNo;

                            $scope.destinationSelected = 'Destination: ' + $rootScope.alreadyBook[i].cabSchedule.destination;
                            $scope.destTOCancel = $rootScope.alreadyBook[i].cabSchedule.destination;
                            var timeofcab = $rootScope.alreadyBook[i].cabSchedule.time.substr(0, 5);
                            var check = parseInt($rootScope.alreadyBook[i].cabSchedule.time.substr(0, 2));
                            var half = $rootScope.alreadyBook[i].cabSchedule.time.substr(2, 3);
                            if (check < 12 && check > 0) {
                                timeofcab += ' AM';
                            }
                            else if (check === 12) {
                                timeofcab += ' PM';
                            }
                            else if (check === 0) {
                                check += 12;
                                timeofcab = check.toString() + half + ' AM';
                            }
                            else {
                                check -= 12;
                                if (check < 10) {
                                    timeofcab = '0' + check.toString() + half + ' PM';
                                }
                                else {
                                    timeofcab = check.toString() + half + ' PM';
                                }

                            }
                            $scope.timeOfCab = timeofcab;
                        }
                        else if (check === 1) {
                            $scope.filler = false;
                            $checkPick = false;
                            $scope.checkDetails = true;
                            $scope.isBookDisabled = true;
                        }
                        else {
                            $scope.filler = true;
                            $scope.checkDetails = false;
                            $scope.isBookDisabled = false;
                        }
                    }


                    function fillBookingDetails(bookingDetails, cid) {
                        $scope.CabNo = bookingDetails.cabNo;
                        $scope.VehicleType = bookingDetails.vehicleType;
                        $scope.DriverName = bookingDetails.driverName;
                        $scope.DriverContactNo = bookingDetails.driverContactNo;
                        getCabAvailSeats(cid);

                    }

                    var uniqueRoutes = [];
                    uniqueRoutes.push($scope.routes[0]);
                    var count1 = 0;
                    for (var i = 0; i < $scope.routes.length; i++) {
                        for (var j = 0; j < uniqueRoutes.length; j++) {
                            var ab = uniqueRoutes[j].dest;
                            var cd = $scope.routes[i].dest;
                            if (cd === ENV.Source) {
                                count1 = 1;
                                break;
                            }
                            if (!ab.localeCompare(cd)) {
                                count1 = 1;
                                break;
                            }
                            else {
                                count1 = 0;
                            }
                        }
                        if (count1 === 0) {
                            uniqueRoutes.push($scope.routes[i]);
                        }
                    }

                    var routesToCompanyU = [];
                    routesToCompanyU.push($scope.routeToCompany[0]);

                    var count = 1;
                    for (var i = 0; i < $scope.routeToCompany.length; i++) {
                        count = 1;
                        var cd = $scope.routeToCompany[i].dest;
                        for (var j = 0; j < routesToCompanyU.length; j++) {
                            var ab = routesToCompanyU[j].dest;
                            if (!ab.localeCompare(cd)) {
                                count = 1;
                                break;
                            }
                            else {
                                count = 0;
                            }
                        }
                        if (count === 0) {
                            routesToCompanyU.push($scope.routeToCompany[i]);
                        }
                    }

                    //toCompany();
                    function toCompany() {
                        $scope.checkPick = false;
                        if ($scope.routeToCompany.length > 0) {
                            $scope.routeSelected = routesToCompanyU[0].dest;
                            $scope.uniqueRoute = routesToCompanyU;
                        }
                        else {
                            $scope.routeSelected = '';
                            $scope.uniqueRoute = [];
                        }
                    }


                    if (uniqueRoutes.length > 0) {
                        //setTime2(routesToCompanyU[0].dest);
                        setTime(uniqueRoutes[0].dest);
                    }
                    else {
                        //setTime2(null);
                        setTime(null);
                    }

                    function getSeats(item) {
                        for (var i = 0; i < $scope.Seats.length; i++) {
                            if ($scope.Seats[i].cabID === item) {
                                $scope.seats = $scope.Seats[i].seat;
                                break;
                            }
                        }
                    }

                    $scope.TabToCompany = 0;
                    $scope.toggleRoute = false;
                    fromCompany();
                    $scope.checkPick = true;

                    function fromCompany() {
                        if ($scope.routes.length > 0) {
                            $scope.uniqueRoute = uniqueRoutes;
                            $scope.routeSelected = uniqueRoutes[0].dest;
                        }
                        else {
                            $scope.uniqueRoute = [];
                            $scope.routeSelected = '';
                        }
                    }
                    //$scope.destSelected();

                    $scope.selectRouteChange = function (location) {
                        $scope.myCookieValue = $cookies.get('cookie');
                        $rootScope.SSO = $scope.myCookieValue;
                        if (isNaN($rootScope.SSO)) {
                            $dialogs.notify('Session expired', "Please login again.");
                            $location.url('login');
                        }
                        else {
                            fillBoardingPoint(location);
                            if ($scope.toggleRoute) {
                                if ($scope.routeToCompany.length > 0) {
                                    setTime2(location);
                                    pickUP();
                                }
                                else {
                                    setTime2(null);
                                }
                            }

                            else {
                                if ($scope.routes.length > 0) {
                                    setTime(location);
                                }
                                else {
                                    setTime(null);
                                }
                            }
                        }
                    }

                    function setTime(location) {
                        if (location != null) {
                            $scope.toCompanySelected = 1;
                            var j = 0;
                            var id = [];
                            for (var i = 0; i < $scope.routes.length; i++) {
                                if ($scope.routes[i].dest === location) {
                                    id[j++] = $scope.routes[i].cabID;
                                }
                            }
                            $rootScope.cabId = id[0];


                            $scope.cabTime = [];
                            var timeS = [];
                            var l = 0;
                            for (var k = 0; k < id.length; k++) {
                                for (var i = 0; i < $scope.timing.length; i++) {
                                    if ($scope.timing[i].cabID === id[k]) {
                                        timeS.push($scope.timing[i]);
                                        break;
                                    }
                                }
                            }

                            var myTime = [];
                            var k = 0;
                            for (var i = 0; i < timeS.length; i++) {
                                myTime[k] = timeS[i].time.substr(0, 5);
                                var check = parseInt(timeS[i].time.substr(0, 2));
                                var half = timeS[i].time.substr(2, 3);
                                if (check < 12 && check > 0) {

                                    myTime[k] += ' AM';
                                }
                                else if (check === 12) {
                                    myTime[k] += ' PM';
                                }
                                else if (check === 0) {
                                    check += 12;
                                    myTime[k] = check.toString() + half + ' AM';
                                }
                                else {
                                    check -= 12;
                                    /*myTime[k] = '0' + check.toString() + half + ' PM';*/
                                    if (check < 10) {
                                        myTime[k] = '0' + check.toString() + half + ' PM';
                                    }
                                    else {
                                        myTime[k] = check.toString() + half + ' PM';
                                    }
                                }
                                k++;
                            }
                            for (var i = 0; i < myTime.length; i++) {
                                $scope.cabTime[i] = {
                                    "cabID": id[i],
                                    "time": myTime[i]
                                }
                            }

                            $scope.cabTime.sort(function (a, b) { return (a.time > b.time) ? 1 : ((b.time > a.time) ? -1 : 0); });

                            $scope.timeSelected = $scope.cabTime[0].cabID;
                            $scope.timeSelect = $scope.cabTime[0].time;
                            $scope.timingF = $scope.cabTime;
                            //getSeats($scope.cabTime[0].cabID);
                            getCabAvailSeats($scope.cabTime[0].cabID);
                        }
                        else {
                            $scope.timeSelected = '';
                            $scope.timeSelect = '';
                            $scope.timingF = [];
                        }
                    }


                    function setTime2(location) {
                        if (location != null) {
                            $scope.toCompanySelected = 0;
                            var j = 0;
                            var id = [];
                            for (var i = 0; i < $scope.routeToCompany.length; i++) {
                                if ($scope.routeToCompany[i].dest === location) {
                                    id[j++] = $scope.routeToCompany[i].cabID;
                                }
                            }
                            $rootScope.cabId = id[0];


                            $scope.cabTime = [];
                            var timeS = [];
                            var l = 0;

                            for (var k = 0; k < id.length; k++) {
                                for (var i = 0; i < $scope.timing.length; i++) {
                                    if ($scope.timing[i].cabID === id[k]) {
                                        timeS.push($scope.timing[i]);
                                        break;
                                    }
                                }
                            }

                            var myTime = [];
                            var k = 0;
                            for (var i = 0; i < timeS.length; i++) {
                                myTime[k] = timeS[i].time.substr(0, 5);
                                var check = parseInt(timeS[i].time.substr(0, 2));
                                var half = timeS[i].time.substr(2, 3);
                                if (check < 12 && check > 0) {

                                    myTime[k] += ' AM';
                                }
                                else if (check === 12) {
                                    myTime[k] += ' PM';
                                }
                                else if (check === 0) {
                                    check += 12;
                                    myTime[k] = check.toString() + half + ' AM';
                                }
                                else {
                                    check -= 12;
                                    if (check < 10) {
                                        myTime[k] = '0' + check.toString() + half + ' PM';
                                    }
                                    else {
                                        myTime[k] = check.toString() + half + ' PM';
                                    }

                                }
                                k++;
                            }

                            for (var i = 0; i < myTime.length; i++) {
                                $scope.cabTime[i] = {
                                    "cabID": id[i],
                                    "time": myTime[i]
                                }
                            }
                            $scope.cabTime.sort(function (a, b) { return (a.time > b.time) ? 1 : ((b.time > a.time) ? -1 : 0); });
                            $scope.timeSelected = $scope.cabTime[0].cabID;
                            $scope.timeSelect = $scope.cabTime[0].time;
                            $scope.timingF = $scope.cabTime;
                            //getSeats($scope.cabTime[0].cabID);
                            getCabAvailSeats($scope.cabTime[0].cabID);
                        }
                        else {
                            $scope.timeSelected = '';
                            $scope.timeSelect = '';
                            $scope.timingF = [];
                        }
                    }


                    function pickUP() {
                        $scope.pick = $scope.routeSelected;
                    }
                    $scope.sourceSelected = function () {
                        $scope.myCookieValue = $cookies.get('cookie');
                        $rootScope.SSO = $scope.myCookieValue;
                        if (isNaN($rootScope.SSO)) {
                            $dialogs.notify('Session expired', "Please login again.");
                            $location.url('login');
                        }
                        else {


                            $scope.TabToCompany = 1;
                            $scope.toggleRoute = true;
                            toCompany();
                            $scope.empName = '';
                            $scope.empSSO = '';
                            $scope.checkPick = false;

                            fillbookingToCompany($scope.bookedToCompany, $scope.indexToCompany);
                            if ($scope.routeToCompany.length > 0) {
                                fillBoardingPoint(routesToCompanyU[0].dest);
                                setTime2(routesToCompanyU[0].dest);
                                if ($rootScope.adminlogin === true) {
                                    $rootScope.cabId = routesToCompanyU[0].cabID;
                                    checkCabSeats();
                                }
                            }

                            else {
                                fillBoardingPoint(null);
                                setTime2(null);
                            }
                            backTOBooking();
                            pickUP();
                            if ($scope.bookedToCompany === 1 && $scope.currentTo === 1) {
                                fillBookingDetails($rootScope.bookDetailsTo, null);
                                $scope.destinationSelected = 'Source: ' + $scope.PickSourceTo;
                                $scope.timeOfCab = $scope.PickTimeTo;
                            }
                            if ($rootScope.userlogin === true) {
                                $dialogs.notify("Note", "Please contact security for pickup facility.");

                                $scope.isBookDisabled = true;

                            }
                        }
                    }

                    $scope.destSelected = function () {
                        $scope.myCookieValue = $cookies.get('cookie');
                        $rootScope.SSO = $scope.myCookieValue;
                        if (isNaN($rootScope.SSO)) {
                            $dialogs.notify('Session expired', "Please login again.");
                            $location.url('login');
                        }
                        else {
                            $scope.TabToCompany = 0;
                            $scope.toggleRoute = false;
                            fromCompany();
                            $scope.empName = '';
                            $scope.empSSO = '';
                            $scope.checkPick = true;
                            if ($scope.routes.length > 0) {
                                fillBoardingPoint(uniqueRoutes[0].dest);
                                setTime(uniqueRoutes[0].dest);
                                if ($rootScope.adminlogin === true) {
                                    $rootScope.cabId = uniqueRoutes[0].cabID;
                                    checkCabSeats();
                                }
                            }
                            else {
                                setTime(null);
                            }
                            $scope.pick = $scope.PickUpLocation;
                            backTOBooking();

                            fillbookingFromCompany($scope.bookedFromCompany, $scope.indexFromCompany);
                            if ($scope.bookedFromCompany === 1 && $scope.currentFrom === 1) {
                                fillBookingDetails($rootScope.bookDetailsFrom, null);
                                $scope.destinationSelected = 'Destination: ' + $scope.PickSourceFrom;
                                $scope.timeOfCab = $scope.PickTimeFrom;
                            }
                        }
                    }


                    $scope.selectTimeChange = function (cid) {
                        $scope.myCookieValue = $cookies.get('cookie');
                        $rootScope.SSO = $scope.myCookieValue;
                        if (isNaN($rootScope.SSO)) {
                            $dialogs.notify('Session expired', "Please login again.");
                            $location.url('login');
                        }
                        else {
                            $rootScope.cabId = cid;
                            getCabAvailSeats(cid);
                        }
                        //getSeats(item);
                    }

                    $scope.clickBook = function (booktimeid) {
                        $scope.myCookieValue = $cookies.get('cookie');
                        $rootScope.SSO = $scope.myCookieValue;
                        if (isNaN($rootScope.SSO)) {
                            $dialogs.notify('Session expired', "Please login again.");
                            $location.url('login');
                        }
                        else {
                            if (booktimeid !== "") {



                                if ($scope.PickUpLocation !== '' || $scope.TabToCompany === 1) {


                                    var currentTime = new Date();
                                    var currentOffset = currentTime.getTimezoneOffset();
                                    var ISTOffset = 330;   // IST offset UTC +5:30 
                                    var ISTTime = new Date(currentTime.getTime() + (ISTOffset + currentOffset) * 60000);
                                    // ISTTime now represents the time in IST coordinates
                                    var hoursIST = parseInt(ISTTime.getHours());
                                    var minutesIST = parseInt(ISTTime.getMinutes());

                                    for (var i = 0; i < $scope.timing.length; i++) {
                                        if ($scope.timing[i].cabID === booktimeid) {
                                            var cabhr = parseInt($scope.timing[i].time.substr(0, 2));
                                            var cabmin = parseInt($scope.timing[i].time.substr(3, 2));
                                            break;
                                        }
                                    }

                                    var daycheck = hoursIST * 60 + minutesIST;
                                    var bookcheck = cabhr * 60 + cabmin;
                                    var timeDiff = bookcheck - daycheck;

                                    if (timeDiff >= 0 && timeDiff < 61) {

                                        var dlg = $dialogs.create('../html/captcha.html', 'captchaController', {}, { key: false, back: 'static' });
                                        dlg.result.then(function (response) {
                                                var text = response;
                                                if ($rootScope.userlogin === true) {
                                                    //$dialogs.notify("Note","This facility is not yet available.");
                                                    var dlg = $dialogs.confirm('Confirm Booking?');
                                                    dlg.result.then(function (btn) {

                                                        bookingdata(booktimeid,text);
                                                    }, function (btn) {

                                                    });
                                                }
                                                else if ($rootScope.adminlogin === true) {
                                                    var dlg = $dialogs.confirm('Confirm Booking?');
                                                    dlg.result.then(function (btn) {
                                                        bookingdatabyadmin(booktimeid,text);
                                                    }, function (btn) {

                                                    });
                                                }
                                                else {
                                                    //alert("Unknown User!!!");
                                                    /*toaster.pop('warning', "Warning", "Unknown User!!!");*/
                                                    $dialogs.notify('Note', 'Unknown User!!!');
                                                }
                                            
                                        }, function (error) {

                                        });

                                    }
                                    else {
                                        $dialogs.error("Book cab one hour prior to scheduled time.");
                                    }
                                }
                                else {
                                    $dialogs.notify("Warning", "Select pick up location!");
                                }
                            }
                            else {
                                //$dialogs.error("Enter a valid captcha code!");
                            }

                        }
                    }

                    function getCabAvailSeats(cid) {
                        if (cid !== null) {
                            var promise = cabFactory.getCabSeats(cid);
                            promise.then(function (success) {
                                $scope.seats = success.data.response;
                            }
                                , function (error) {
                                    if (error.data != null) {
                                        if (error.data.hasOwnProperty('response')) {
                                            //toaster.pop('error', "Error", error.data.response);
                                            $dialogs.error(error.data.response);
                                        }
                                        else {
                                            //toaster.pop('error', "Error", error.data.error);
                                        }
                                    }
                                    else {
                                        //toaster.pop('note', "Note", "No response from server please try later");
                                        $dialogs.notify('Something went wrong', "No response from server please try later");
                                    }
                                });
                        }
                        else {

                        }
                    }

                    function bookingdatabyadmin(cabid,text) {

                        if ($scope.empSSO != '000000000') {

                            var j = 0;
                            for (var i = 0; i < $scope.empName.length; i++) {
                                if ($scope.empName[i] === ' ') {
                                    var fname = $scope.empName.substring(0, i);
                                    var lastname = $scope.empName.substring(i + 1, $scope.empName.length);
                                    j = 1;
                                    break;
                                }
                            }
                            if (j === 0) {
                                fname = $scope.empName;
                            }
                            var bookData = [];
                            var pickup = '';
                            for (var i = 0; i < $scope.boardingPT.length; i++) {
                                if ($scope.boardingPT[i].boardingPtId === $scope.boardingPtSelected) {
                                    pickup = $scope.boardingPT[i].boardingPt;
                                    break;
                                }
                            }
                            if ($scope.TabToCompany === 0) {
                                pickup = $scope.PickUpLocation;
                            }
                            for (var i = 0; i < $scope.cabBookingData.length; i++) {
                                if ($scope.cabBookingData[i].cabScheduleId === cabid) {
                                    bookData = {
                                        "sso": $scope.empSSO,
                                        "firstname": fname,
                                        "lastname": lastname,
                                        "cabScheduleId": $scope.cabBookingData[i].cabScheduleId,
                                        "boardingpt": pickup,
                                    };
                                }
                            }

                            var promise = cabFactory.bookingData(bookData,text);
                            promise.then(function (success) {

                                if (success.data.hasOwnProperty('response')) {
                                    //alert(success.data.response);
                                    //toaster.pop('error', "Error", success.data.response);
                                    $dialogs.error(success.data.response);
                                }
                                else {
                                    //alert("Booking Successful..");
                                    //toaster.pop('sucess', "Success", "Booking Successful..");
                                    $dialogs.notify('Success', "Booking Successful...");
                                    $scope.empName = '';
                                    $scope.empSSO = '';
                                    $scope.book = false;
                                    $rootScope.cabId = cabid;
                                    $scope.checkCab();
                                    getCabAvailSeats(cabid);
                                }
                                $log.info(success);
                            }, function (error) {
                                $scope.book = false;

                                if (error.data != null) {
                                    if (error.data.hasOwnProperty('response')) {
                                        //alert(error.data.response);
                                        //toaster.pop('error', "Error", error.data.response);
                                        $dialogs.error(error.data.response);

                                    }
                                    else {
                                        //toaster.pop('error', "Error", error.data.error);
                                    }
                                }
                                else {
                                    //toaster.pop('note', "Note", "No response from server please try later");
                                    $dialogs.notify('Something went wrong', "No response from server please try later");
                                }
                            });
                        }
                        else {
                            //toaster.pop('error', "Error", "This is not a valid sso");
                            $dialogs.error("This is not a valid sso");
                        }

                    }

                    $scope.selectPickUP = function () {
                        $scope.myCookieValue = $cookies.get('cookie');
                        $rootScope.SSO = $scope.myCookieValue;
                        if (isNaN($rootScope.SSO)) {
                            $dialogs.notify('Session expired', "Please login again.");
                            $location.url('login');
                        }
                    }
                    $scope.pickSelected1 = function () {
                        $scope.myCookieValue = $cookies.get('cookie');
                        $rootScope.SSO = $scope.myCookieValue;
                        if (isNaN($rootScope.SSO)) {
                            $dialogs.notify('Session expired', "Please login again.");
                            $location.url('login');
                        }
                    }
                    $scope.pickSelected2 = function () {
                        $scope.myCookieValue = $cookies.get('cookie');
                        $rootScope.SSO = $scope.myCookieValue;
                        if (isNaN($rootScope.SSO)) {
                            $dialogs.notify('Session expired', "Please login again.");
                            $location.url('login');
                        }
                    }

                    function bookingdata(cabid,text) {

                        var bookData = [];
                        var pickup = '';
                        for (var i = 0; i < $scope.boardingPT.length; i++) {
                            if ($scope.boardingPT[i].boardingPtId === $scope.boardingPtSelected) {
                                pickup = $scope.boardingPT[i].boardingPt;
                                break;
                            }
                        }
                        if ($scope.TabToCompany === 0) {
                            pickup = $scope.PickUpLocation;
                        }
                        for (var i = 0; i < $scope.cabBookingData.length; i++) {
                            if ($scope.cabBookingData[i].cabScheduleId === cabid) {
                                bookData = {
                                    "sso": $rootScope.SSO,
                                    "cabScheduleId": $scope.cabBookingData[i].cabScheduleId,
                                    "boardingpt": pickup,
                                };

                                $scope.destTOCancel = $scope.cabBookingData[i].destination;
                                if ($scope.TabToCompany === 1) {
                                    $scope.destinationSelected = 'Source: ' + pickup;
                                    $scope.PickSourceTo = pickup;
                                }
                                else {
                                    $scope.destinationSelected = 'Destination ' + $scope.cabBookingData[i].destination;
                                    $scope.PickSourceFrom = $scope.cabBookingData[i].destination;
                                }
                                var timeofcab = $scope.cabBookingData[i].time.substr(0, 5);
                                var check = parseInt($scope.cabBookingData[i].time.substr(0, 2));
                                var half = $scope.cabBookingData[i].time.substr(2, 3);
                                if (check < 12 && check > 0) {
                                    timeofcab += ' AM';
                                }
                                else if (check === 12) {
                                    timeofcab += ' PM';
                                }
                                else if (check === 0) {
                                    check += 12;
                                    timeofcab = check.toString() + half + ' AM';
                                }
                                else {
                                    check -= 12;

                                    if (check < 10) {
                                        timeofcab = '0' + check.toString() + half + ' PM';
                                    }
                                    else {
                                        timeofcab = check.toString() + half + ' PM';
                                    }

                                }
                                $scope.timeOfCab = timeofcab;
                                break;
                            }
                        }
                        var promise = cabFactory.bookingData(bookData,text);
                        promise.then(function (success) {

                            if (success.data.hasOwnProperty('response')) {
                                //alert(success.data.response);
                                //toaster.pop('warning', "Warning", success.data.response);
                                $dialogs.error(success.data.response);
                            }
                            else {
                                //alert("Booking Successful..");
                                //toaster.pop('success', "Success", "Booking Successful..");
                                $dialogs.notify('Success', "Your seat has been booked.");

                                //$dialogs.notify('Success',"Booking Successfull..")
                                if ($scope.TabToCompany === 1) {
                                    $scope.bookedToCompany = 1;
                                    fillbookingToCompany(0, -1);
                                    $scope.cabCancelIDTo = bookData.cabScheduleId;
                                    $scope.currentTo = 1;
                                    $scope.PickTimeTo = timeofcab;
                                    $rootScope.bookDetailsTo = success.data;
                                    fillBookingDetails($rootScope.bookDetailsTo, bookData.cabScheduleId);
                                }
                                else {
                                    $scope.bookedFromCompany = 1;
                                    fillbookingFromCompany(0, -1);
                                    $scope.currentFrom = 1;
                                    $scope.cabCancelIDFrom = bookData.cabScheduleId;
                                    $scope.PickTimeFrom = timeofcab;
                                    $rootScope.bookDetailsFrom = success.data;
                                    fillBookingDetails($rootScope.bookDetailsFrom, bookData.cabScheduleId);
                                }
                                $scope.filler = false;
                                $scope.checkDetails = true;
                                $scope.checkCabDetails = false;
                                $scope.isBookDisabled = true;
                                $checkPick = false;

                            }
                            $log.info(success);
                        }, function (error) {
                            if (error.data != null) {
                                $scope.book = false;
                                if (error.data.hasOwnProperty('response')) {
                                    //alert(error.data.response);
                                    //toaster.pop('error', "Error", error.data.response);
                                    $dialogs.error(error.data.response);
                                }
                                else {
                                    //toaster.pop('error', "Error", error.data.error);
                                }
                            }
                            else {
                                //toaster.pop('note', "Note", "No response from server please try later");
                                $dialogs.notify('Something went wrong', "No response from server please try later");
                            }
                        });

                    }

                    $scope.bookingCancel = function () {
                        var currentTime = new Date();
                        var currentOffset = currentTime.getTimezoneOffset();
                        var ISTOffset = 330;   // IST offset UTC +5:30 
                        var ISTTime = new Date(currentTime.getTime() + (ISTOffset + currentOffset) * 60000);
                        // ISTTime now represents the time in IST coordinates
                        var hoursIST = parseInt(ISTTime.getHours());
                        var minutesIST = parseInt(ISTTime.getMinutes());


                        var cabhr = parseInt($scope.timeOfCab.substr(0, 2));
                        var cabmin = parseInt($scope.timeOfCab.substr(3, 2));
                        if ($scope.timeOfCab.substr(6, 7) === "PM" && cabhr != 12) {
                            cabhr += 12;
                        }


                        var daycheck = hoursIST * 60 + minutesIST;
                        var cancelcheck = cabhr * 60 + cabmin;


                        if ((cancelcheck - daycheck) < 15) {
                            $dialogs.error('Cancel booking time exceeded. Sorry you can not book cab for today.');
                        }
                        else {
                            var dlg = $dialogs.confirm('Are you sure you want to cancel?');
                            dlg.result.then(function (btn) {
                                var cancelDest = '';
                                if ($scope.TabToCompany === 1) {
                                    cancelDest = $scope.PickUpLocation;
                                }
                                if ($scope.TabToCompany === 0) {
                                    cancelDest = $scope.destTOCancel;
                                }
                                cancelBooking($rootScope.SSO, cancelDest);
                            }, function (btn) {

                            });
                        }
                    }

                    $scope.checkCab = function () {
                        $scope.myCookieValue = $cookies.get('cookie');
                        $rootScope.SSO = $scope.myCookieValue;
                        if (isNaN($rootScope.SSO)) {
                            $dialogs.notify('Session expired', "Please login again.");
                            $location.url('login');
                        }
                        else {
                            checkCabSeats();
                        }
                    }

                    function checkCabSeats() {
                        if ($rootScope.cabId !== null) {
                            $scope.checkCabDetails = true;
                            $scope.checkDetails = false;
                            $scope.filler = false;
                            var cabid = $rootScope.cabId;
                            getCabAvailSeats(cabid);
                            var promise = cabFactory.getCabDetails(cabid);
                            promise.then(function (success) {
                                if (success.data.hasOwnProperty("response")) {

                                    $scope.cabdetails = [];
                                    $scope.fetched = false;
                                }
                                else {
                                    $scope.cabdetails = success.data;

                                    var timeofcab = $scope.cabdetails[0].cabSchedule.time.substr(0, 5);
                                    var check = parseInt($scope.cabdetails[0].cabSchedule.time.substr(0, 2));
                                    var half = $scope.cabdetails[0].cabSchedule.time.substr(2, 3);
                                    if (check < 12 && check > 0) {
                                        timeofcab += ' AM';
                                    }
                                    else if (check === 12) {
                                        timeofcab += ' PM';
                                    }
                                    else if (check === 0) {
                                        check += 12;
                                        timeofcab = check.toString() + half + ' AM';
                                    }
                                    else {
                                        check -= 12;
                                        if (check < 10) {
                                            timeofcab = '0' + check.toString() + half + ' PM';
                                        }
                                        else {
                                            timeofcab = check.toString() + half + ' PM';
                                        }

                                    }
                                    $scope.cabCheckedTime = timeofcab;

                                    $scope.fetched = true;
                                    $log.info(success);
                                }
                            }, function (error) {
                                if (error.data != null) {
                                    if (error.data.hasOwnProperty('response')) {
                                        //alert(error.data.response);
                                        $scope.cabdetails = [];
                                        $scope.fetched = false;
                                        //toaster.pop('error', "Error", error.data.response);
                                        $dialogs.error(error.data.response);
                                    }
                                    else {
                                        //toaster.pop('error', "Error", error.data.error);
                                    }
                                }
                                else {
                                    //toaster.pop('note', "Note", "No response from server please try later");
                                    $dialogs.notify('Something went wrong', "No response from server please try later");
                                }
                            });
                        }
                        else {
                            $scope.NoBooking = true;
                        }
                    }
                    $scope.backtobooking = function () {
                        $scope.myCookieValue = $cookies.get('cookie');
                        $rootScope.SSO = $scope.myCookieValue;
                        if (isNaN($rootScope.SSO)) {
                            $dialogs.notify('Session expired', "Please login again.");
                            $location.url('login');
                        }
                        else {
                            backTOBooking();
                        }
                    }

                    function backTOBooking() {
                        $scope.checkCabDetails = false;
                        if ($scope.bookedFromCompany === 1 && $scope.TabToCompany === 0) {
                            $scope.checkDetails = true;
                        }
                        else if ($scope.bookedToCompany === 1 && $scope.TabToCompany === 1) {
                            $scope.checkDetails = true;
                        }
                        else {
                            $scope.filler = true;
                        }
                    }

                    function cancelBooking(sso, cancelDest, cid) {
                        var promise = cabFactory.cancelbooking(sso, cancelDest);
                        promise.then(function (success) {
                            var check = success.data;
                            //alert(check.response);
                            $scope.cancelBook = false;
                            //toaster.pop('success', "Success", check.response);
                            $dialogs.notify('Success', check.response);
                            if ($scope.TabToCompany === 1) {
                                fillbookingToCompany(0, -1);
                                $scope.bookedToCompany = 0;
                                cancelDest = $scope.PickUpLocation;
                                if ($rootScope.userlogin === true) {
                                    getCabAvailSeats($scope.cabCancelIDTo);
                                }
                                else if ($rootScope.adminlogin === true) {
                                    $scope.checkCab();
                                    //checkCabSeats();
                                    getCabAvailSeats(cid);
                                }
                            }
                            if ($scope.TabToCompany === 0) {
                                fillbookingFromCompany(0, -1);
                                $scope.bookedFromCompany = 0;
                                cancelDest = $scope.destTOCancel;
                                if ($rootScope.userlogin === true) {
                                    getCabAvailSeats($scope.cabCancelIDFrom);
                                }
                                else if ($rootScope.adminlogin === true) {
                                    $scope.checkCab();
                                    //checkCabSeats();
                                    getCabAvailSeats(cid);
                                }
                            }
                            $log.info(success);
                        }, function (error) {
                            //alert(error.data);
                            $scope.cancelBook = false;
                            if (error.data != null) {
                                if (error.data.hasOwnProperty('response')) {
                                    //toaster.pop('error', "Error", error.data.response);
                                    $dialogs.error(error.data.response);
                                }
                                else {
                                    //toaster.pop('error', "Error", error.data.error);
                                }
                            }
                            else {
                                //toaster.pop('note', "Note", "No response from server please try later");
                                $dialogs.notify('Something went wrong', "No response from server please try later");
                            }
                        });
                    }

                    $scope.deleteBooking = function (cancelSso, cancelDest, id) {

                        var dlg = $dialogs.confirm('Are you sure you want to cancel?');
                        dlg.result.then(function (btn) {

                            cancelBooking(cancelSso, cancelDest, id);
                            $rootScope.cabId = id;
                            checkCabSeats();
                            //getCabAvailSeats(id);


                        }, function (btn) {

                        });

                    }


                }, function (error) {
                    $rootScope.loading = false;
                    $scope.checkDetails = false;
                    if (error.data != null) {

                        if (error.data.hasOwnProperty('response')) {
                            //toaster.pop('error', "Error", error.data.response);
                            $dialogs.error(error.data.response);
                        }
                        else {
                            //toaster.pop('error', "Error", error.data.error);
                        }
                    }
                    else {
                        $rootScope.loading = false;
                        //toaster.pop('note', "Note", "No response from server please try later");
                        $dialogs.notify('Something went wrong', "No response from server please try later");
                    }
                });

            }, 1000);


        }

        $scope.init();

    }]);
