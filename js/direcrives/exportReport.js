/**
 * Created by 212612730 on 7/12/2017.
 */
CabApp.directive('exportToCsv',function(){
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var el = element[0];
            element.bind('click', function(e){
                var table = e.target.previousElementSibling;
                var csvString = '';
                for(var i=0; i<table.rows.length;i++){
                    var rowData = table.rows[i].cells;
                    for(var j=0; j<rowData.length-1;j++){
                        csvString = csvString + rowData[j].innerHTML + ",";
                    }
                    /*if(i == (table.rows.length-2)){
                        csvString = csvString + rowData[rowData.length-1].innerHTML + ",";
                    }
                    if(i == (table.rows.length-1)){
                        csvString = csvString + rowData[rowData.length-1].innerHTML + ",";
                    }*/
                    csvString = csvString.substring(0,csvString.length - 1);
                    csvString = csvString + "\n";
                }
                var d = new Date();
                //console.log(d.getDate()+'_'+d.getMonth()+'_'+d.getFullYear());
                var day = parseInt(d.getMonth())+1;
                var date = d.getDate()+'_'+day.toString()+'_'+d.getFullYear();
                csvString = csvString.substring(0, csvString.length - 1);
                var a = $('<a/>', {
                    style:'display:none',
                    href:'data:application/octet-stream;base64,'+btoa(csvString),
                    download:'CabBookingDetails'+date+'.csv'
                }).appendTo('body')
                a[0].click()
                a.remove();
            });
        }
    }
});