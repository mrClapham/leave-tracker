var AppMain = new angular.module('AppMain', [ "ngRoute", "ui.bootstrap"])
AppMain.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/tracker', {
                templateUrl: 'js/modules/app/app.html'
            }).
            when('/', {
                templateUrl: 'js/modules/app/app.html'
            }).
            otherwise({
                redirectTo: '/#/'
            });
    }]);

AppMain.controller('AppController', ['$scope', 'AppControllerModel', function($scope, appControllerModel){
    $scope.testData = "AppController data"



    $scope.createTweenColours = function(start, end, steps){
        var _r, _g, _b, _rstep, _gstep, _bstep;
        _r = start.r;
        _g = start.g;
        _b = start.b;

        var returnArray = [];

        _rstep =  0 - Math.round( parseFloat(start.r - end.r) / steps  );
        _gstep =  0 - Math.round( parseFloat(start.g - end.g) / steps  );
        _bstep =  0 - Math.round( parseFloat(start.b - end.b) / steps  );

        for(var i=0; i<steps; i++){
            var o = 'rgba('+_r+','+_g+','+_b+', 1)'
            returnArray.push(o);
            _r += _rstep;
            _g += _gstep;
            _b += _bstep;
        }

        return returnArray;
    }


// Get rid of the ones with no date and add a javaScript date to the array.
    $scope.cleanData = function(){
        var key = 0
        return _.forEach(_.filter(appControllerModel.data, function(n){
            return n.date && n.date != undefined
        }), function(n){
            n.key = key;
            key++
            n.jsDate = $scope.stringToDate(n.date)
            return n})
    }

    $scope.stringToDate=function(string){
        if(!string) return;
        var arr = string.split("/")
        if(arr.length != 3 ){
            return
        }
        return new Date(arr[2], arr[1]-1, arr[0])
    }

    $scope.dateToString=function(date){
        if(!date) return;
        if(!date.getFullYear()) return // it isnt a date
        var year, month, day;
        year = date.getFullYear();
        month = date.getMonth()+1
        day = date.getDate();
        var retSting = day+"/"+month+"/"+year
        return retSting
    }

    $scope.getAllDates = function(){
        return _.map(appControllerModel.data, function(n){
            return $scope.stringToDate( n.date );
        })
    }

    $scope.getMinAndMaxDates = function(){
        return {min: _.min($scope.getAllDates()) , max: _.max($scope.getAllDates()) }
    }

    $scope.addDate = function(userid, name, date, unit, value){
        var key = $scope.getHighestKey().key+1
        var dateString = $scope.dateToString(date)
        appControllerModel.data.push({userid:userid, name:name, date:dateString, jsDate:date, unit:unit, value:value, jsDate:date, key:key})
    }

    $scope.removeDate = function(key){
        console.log(key)
        _.remove(appControllerModel.data, function(n) { return n.key == key; });
    }

    $scope.createCalandarArray = function(){
        var a = [];
        var startDate = $scope.getMinAndMaxDates().min;
        a.push(new Date(startDate))

        while(startDate < $scope.getMinAndMaxDates().max){
            startDate.setDate(startDate.getDate()+1);
            //ignore weekends
            if(startDate.getDay() != 0 &&  startDate.getDay() != 6){
            a.push(new Date(startDate))
            }
        }
        return(a);
    }

    $scope.dataByName = function( value ){
        return _.filter(appControllerModel.data, function(n){
          return   n.name == value
        })
    }

    $scope.dataByDate = function( value ){
        return _.filter(appControllerModel.data, function(n){
            if(!n.jsDate){
                return false
            } else{
               return  String(n.jsDate) == String(value)
            }
        })
    }

    $scope.getAllData = function(){
        return appControllerModel.data
    }

    $scope.getHighestKey = function(){
       return _.max(appControllerModel.data, function(n){ return n.key })
        }

    $scope.onAddButtonClicked = function(){
        console.log( $scope.getHighestKey().key  );

        $scope.addDate("1", "Matthew Webb", new Date() , "AM", "V")

        }
// Add some varibles to the scope from the functions above
    $scope.dateList =  $scope.createCalandarArray();

    $scope.nameList = (function(){
        console.log("nameList is being called")
        return _.filter(_.uniq(_.map(appControllerModel.data, "name")), function(n){ return _.isString(n) })
    })();
    // this function may be firing too often
    $scope.StaticNamesList = _.clone($scope.nameList)

    $scope.colourArray = $scope.createTweenColours({r:0,g:255,b:0}, {r:255,g:0,b:255}, $scope.nameList.length)
    $scope.nameColour = function(name){
       var index =  _.indexOf($scope.nameList, name);
        return $scope.colourArray[index];
    }

    console.log("THE COLOUR IS ",$scope.nameColour("Matthew Webb") )
    $scope.cleanData()

    // The worker


    $scope.currentWorker = $scope.nameList[0];
    $scope.uints = ["AM", "PM"];
    $scope.unit = $scope.uints[0];
    $scope.values = ['Vacation', 'Public Holiday', 'Training']
    $scope.value = $scope.values[0];

    $scope.setCurrentWorker= function(value){
        $scope.currentWorker = value;
    }

    $scope.setCurrentValue = function(value){
        $scope.unit = value;
    }

    $scope.setCurrentUnit = function(value){
        $scope.value = value;
    }

    $scope.cellWidth = Math.floor(900/$scope.nameList.length)+"px";

    $scope.submit = function(){
        var arrayPos = _.indexOf($scope.nameList, $scope.currentWorker)
        $scope.addDate(arrayPos+1, $scope.currentWorker, $scope.dt , $scope.unit, $scope.value.charAt(0))

    }

    $scope.calculateLeftPosition = function(key, width){
        return ((parseInt(key) * parseInt(width))-parseInt(width))+"px";
    }


//-- All the datepicker stuff --


    $scope.today = function() {
        $scope.dt = new Date();
    };
   // $scope.today();
    $scope.dt = $scope.minDate  = _.clone($scope.getMinAndMaxDates().min);

    $scope.clear = function () {
        $scope.dt = null;
    };

    // Disable weekend selection
    $scope.disabled = function(date, mode) {
        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };

    $scope.toggleMin = function() {
        $scope.minDate = $scope.minDate ? null : new Date();
    };
    //$scope.toggleMin();

    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];

    //--- ens of all the datepicker stuff -------

}])


AppMain.factory('AppControllerModel', function(){
    return {title:"Main Model",


        data: [
            {
                "userid": "1",
                "name": "Matthew Webb",
                "date": "06/10/2014",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "1",
                "name": "Matthew Webb",
                "date": "06/10/2014",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "1",
                "name": "Matthew Webb",
                "date": "07/10/2014",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "1",
                "name": "Matthew Webb",
                "date": "07/10/2014",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "1",
                "name": "Matthew Webb",
                "date": "08/10/2014",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "1",
                "name": "Matthew Webb",
                "date": "08/10/2014",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "1",
                "name": "Matthew Webb",
                "date": "09/10/2014",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "1",
                "name": "Matthew Webb",
                "date": "09/10/2014",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "1",
                "name": "Matthew Webb",
                "date": "10/10/2014",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "1",
                "name": "Matthew Webb",
                "date": "10/10/2014",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "1",
                "name": "Matthew Webb",
                "date": "20/10/2014",
                "unit": "AM",
                "value": "T"
            },
            {
                "userid": "1",
                "name": "Matthew Webb",
                "date": "20/11/2014",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "1",
                "name": "Matthew Webb",
                "date": "20/11/2014",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "1",
                "name": "Matthew Webb",
                "date": "21/11/2014",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "1",
                "name": "Matthew Webb",
                "date": "21/11/2014",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "1",
                "name": "Matthew Webb",
                "date": "25/12/2014",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "1",
                "name": "Matthew Webb",
                "date": "25/12/2014",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "1",
                "name": "Matthew Webb",
                "date": "26/12/2014",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "1",
                "name": "Matthew Webb",
                "date": "26/12/2014",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "1",
                "name": "Matthew Webb",
                "date": "01/01/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "1",
                "name": "Matthew Webb",
                "date": "01/01/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "1",
                "name": "Matthew Webb",
                "date": "03/04/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "1",
                "name": "Matthew Webb",
                "date": "06/04/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "1",
                "name": "Matthew Webb",
                "date": "06/04/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "1",
                "name": "Matthew Webb",
                "date": "13/04/2015",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "1",
                "name": "Matthew Webb",
                "date": "13/04/2015",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "1",
                "name": "Matthew Webb",
                "date": "14/04/2015",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "1",
                "name": "Matthew Webb",
                "date": "14/04/2015",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "1",
                "name": "Matthew Webb",
                "date": "15/04/2015",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "1",
                "name": "Matthew Webb",
                "date": "15/04/2015",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "1",
                "name": "Matthew Webb",
                "date": "16/04/2015",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "1",
                "name": "Matthew Webb",
                "date": "16/04/2015",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "1",
                "name": "Matthew Webb",
                "date": "17/04/2015",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "1",
                "name": "Matthew Webb",
                "date": "17/04/2015",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "1",
                "name": "Matthew Webb",
                "date": "04/05/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "1",
                "name": "Matthew Webb",
                "date": "04/05/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "1",
                "name": "Matthew Webb",
                "date": "25/05/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "1",
                "name": "Matthew Webb",
                "date": "25/05/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "1",
                "name": "Matthew Webb",
                "date": "31/08/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "1",
                "name": "Matthew Webb",
                "date": "31/08/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "1",
                "name": "Matthew Webb",
                "date": "11/11/2015",
                "unit": "AM",
                "value": "T"
            },
            {
                "userid": "1",
                "name": "Matthew Webb",
                "date": "11/11/2015",
                "unit": "PM",
                "value": "T"
            },
            {
                "userid": "1",
                "name": "Matthew Webb",
                "date": "25/12/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "1",
                "name": "Matthew Webb",
                "date": "25/12/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "1",
                "name": "Matthew Webb",
                "date": "28/12/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "1",
                "name": "Matthew Webb",
                "date": "28/12/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": ""
            },
            {
                "userid": ""
            },
            {
                "userid": "2",
                "name": "Thomas William Burgess",
                "date": "22/12/2014",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "2",
                "name": "Thomas William Burgess",
                "date": "22/12/2014",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "2",
                "name": "Thomas William Burgess",
                "date": "23/12/2014",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "2",
                "name": "Thomas William Burgess",
                "date": "23/12/2014",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "2",
                "name": "Thomas William Burgess",
                "date": "24/12/2014",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "2",
                "name": "Thomas William Burgess",
                "date": "24/12/2014",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "2",
                "name": "Thomas William Burgess",
                "date": "25/12/2014",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "2",
                "name": "Thomas William Burgess",
                "date": "25/12/2014",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "2",
                "name": "Thomas William Burgess",
                "date": "26/12/2014",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "2",
                "name": "Thomas William Burgess",
                "date": "26/12/2014",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "2",
                "name": "Thomas William Burgess",
                "date": "01/01/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "2",
                "name": "Thomas William Burgess",
                "date": "01/01/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "2",
                "name": "Thomas William Burgess",
                "date": "03/04/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "2",
                "name": "Thomas William Burgess",
                "date": "06/04/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "2",
                "name": "Thomas William Burgess",
                "date": "06/04/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "2",
                "name": "Thomas William Burgess",
                "date": "04/05/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "2",
                "name": "Thomas William Burgess",
                "date": "04/05/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "2",
                "name": "Thomas William Burgess",
                "date": "25/05/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "2",
                "name": "Thomas William Burgess",
                "date": "25/05/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "2",
                "name": "Thomas William Burgess",
                "date": "31/08/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "2",
                "name": "Thomas William Burgess",
                "date": "31/08/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "2",
                "name": "Thomas William Burgess",
                "date": "11/11/2015",
                "unit": "AM",
                "value": "T"
            },
            {
                "userid": "2",
                "name": "Thomas William Burgess",
                "date": "11/11/2015",
                "unit": "PM",
                "value": "T"
            },
            {
                "userid": "2",
                "name": "Thomas William Burgess",
                "date": "25/12/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "2",
                "name": "Thomas William Burgess",
                "date": "25/12/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "2",
                "name": "Thomas William Burgess",
                "date": "28/12/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "2",
                "name": "Thomas William Burgess",
                "date": "28/12/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "3",
                "name": "Henry Sullivan",
                "date": "22/12/2014",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "3",
                "name": "Henry Sullivan",
                "date": "22/12/2014",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "3",
                "name": "Henry Sullivan",
                "date": "23/12/2014",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "3",
                "name": "Henry Sullivan",
                "date": "23/12/2014",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "3",
                "name": "Henry Sullivan",
                "date": "24/12/2014",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "3",
                "name": "Henry Sullivan",
                "date": "24/12/2014",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "3",
                "name": "Henry Sullivan",
                "date": "25/12/2014",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "3",
                "name": "Henry Sullivan",
                "date": "25/12/2014",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "3",
                "name": "Henry Sullivan",
                "date": "26/12/2014",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "3",
                "name": "Henry Sullivan",
                "date": "26/12/2014",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "3",
                "name": "Henry Sullivan",
                "date": "01/01/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "3",
                "name": "Henry Sullivan",
                "date": "01/01/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "3",
                "name": "Henry Sullivan",
                "date": "03/04/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "3",
                "name": "Henry Sullivan",
                "date": "06/04/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "3",
                "name": "Henry Sullivan",
                "date": "06/04/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "3",
                "name": "Henry Sullivan",
                "date": "04/05/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "3",
                "name": "Henry Sullivan",
                "date": "04/05/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "3",
                "name": "Henry Sullivan",
                "date": "25/05/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "3",
                "name": "Henry Sullivan",
                "date": "25/05/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "3",
                "name": "Henry Sullivan",
                "date": "31/08/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "3",
                "name": "Henry Sullivan",
                "date": "31/08/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "3",
                "name": "Henry Sullivan",
                "date": "11/11/2015",
                "unit": "AM",
                "value": "T"
            },
            {
                "userid": "3",
                "name": "Henry Sullivan",
                "date": "11/11/2015",
                "unit": "PM",
                "value": "T"
            },
            {
                "userid": "3",
                "name": "Henry Sullivan",
                "date": "25/12/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "3",
                "name": "Henry Sullivan",
                "date": "25/12/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "3",
                "name": "Henry Sullivan",
                "date": "28/12/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "3",
                "name": "Henry Sullivan",
                "date": "28/12/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "4",
                "name": "Enrique Tirabocchi",
                "date": "03/11/2014",
                "unit": "AM",
                "value": "T"
            },
            {
                "userid": "4",
                "name": "Enrique Tirabocchi",
                "date": "03/11/2014",
                "unit": "PM",
                "value": "T"
            },
            {
                "userid": "4",
                "name": "Enrique Tirabocchi",
                "date": "22/12/2014",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "4",
                "name": "Enrique Tirabocchi",
                "date": "22/12/2014",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "4",
                "name": "Enrique Tirabocchi",
                "date": "23/12/2014",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "4",
                "name": "Enrique Tirabocchi",
                "date": "23/12/2014",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "4",
                "name": "Enrique Tirabocchi",
                "date": "24/12/2014",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "4",
                "name": "Enrique Tirabocchi",
                "date": "24/12/2014",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "4",
                "name": "Enrique Tirabocchi",
                "date": "25/12/2014",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "4",
                "name": "Enrique Tirabocchi",
                "date": "25/12/2014",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "4",
                "name": "Enrique Tirabocchi",
                "date": "26/12/2014",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "4",
                "name": "Enrique Tirabocchi",
                "date": "26/12/2014",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "4",
                "name": "Enrique Tirabocchi",
                "date": "01/01/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "4",
                "name": "Enrique Tirabocchi",
                "date": "01/01/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "4",
                "name": "Enrique Tirabocchi",
                "date": "03/04/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "4",
                "name": "Enrique Tirabocchi",
                "date": "06/04/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "4",
                "name": "Enrique Tirabocchi",
                "date": "06/04/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "4",
                "name": "Enrique Tirabocchi",
                "date": "04/05/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "4",
                "name": "Enrique Tirabocchi",
                "date": "04/05/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "4",
                "name": "Enrique Tirabocchi",
                "date": "25/05/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "4",
                "name": "Enrique Tirabocchi",
                "date": "25/05/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "4",
                "name": "Enrique Tirabocchi",
                "date": "31/08/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "4",
                "name": "Enrique Tirabocchi",
                "date": "31/08/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "4",
                "name": "Enrique Tirabocchi",
                "date": "11/11/2015",
                "unit": "AM",
                "value": "T"
            },
            {
                "userid": "4",
                "name": "Enrique Tirabocchi",
                "date": "11/11/2015",
                "unit": "PM",
                "value": "T"
            },
            {
                "userid": "4",
                "name": "Enrique Tirabocchi",
                "date": "25/12/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "4",
                "name": "Enrique Tirabocchi",
                "date": "25/12/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "4",
                "name": "Enrique Tirabocchi",
                "date": "28/12/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "4",
                "name": "Enrique Tirabocchi",
                "date": "28/12/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "5",
                "name": "Charles Toth",
                "date": "23/12/2014",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "5",
                "name": "Charles Toth",
                "date": "23/12/2014",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "5",
                "name": "Charles Toth",
                "date": "24/12/2014",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "5",
                "name": "Charles Toth",
                "date": "24/12/2014",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "5",
                "name": "Charles Toth",
                "date": "25/12/2014",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "5",
                "name": "Charles Toth",
                "date": "25/12/2014",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "5",
                "name": "Charles Toth",
                "date": "26/12/2014",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "5",
                "name": "Charles Toth",
                "date": "26/12/2014",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "5",
                "name": "Charles Toth",
                "date": "01/01/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "5",
                "name": "Charles Toth",
                "date": "01/01/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "5",
                "name": "Charles Toth",
                "date": "02/02/2015",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "5",
                "name": "Charles Toth",
                "date": "03/04/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "5",
                "name": "Charles Toth",
                "date": "06/04/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "5",
                "name": "Charles Toth",
                "date": "06/04/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "5",
                "name": "Charles Toth",
                "date": "04/05/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "5",
                "name": "Charles Toth",
                "date": "04/05/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "5",
                "name": "Charles Toth",
                "date": "25/05/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "5",
                "name": "Charles Toth",
                "date": "25/05/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "5",
                "name": "Charles Toth",
                "date": "31/08/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "5",
                "name": "Charles Toth",
                "date": "31/08/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "5",
                "name": "Charles Toth",
                "date": "25/12/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "5",
                "name": "Charles Toth",
                "date": "25/12/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "5",
                "name": "Charles Toth",
                "date": "28/12/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "5",
                "name": "Charles Toth",
                "date": "28/12/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "6",
                "name": "Gertrude Ederle",
                "date": "27/10/2014",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "6",
                "name": "Gertrude Ederle",
                "date": "27/10/2014",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "6",
                "name": "Gertrude Ederle",
                "date": "28/10/2014",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "6",
                "name": "Gertrude Ederle",
                "date": "28/10/2014",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "6",
                "name": "Gertrude Ederle",
                "date": "29/10/2014",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "6",
                "name": "Gertrude Ederle",
                "date": "29/10/2014",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "6",
                "name": "Gertrude Ederle",
                "date": "30/10/2014",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "6",
                "name": "Gertrude Ederle",
                "date": "30/10/2014",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "6",
                "name": "Gertrude Ederle",
                "date": "31/10/2014",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "6",
                "name": "Gertrude Ederle",
                "date": "31/10/2014",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "6",
                "name": "Gertrude Ederle",
                "date": "25/12/2014",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "6",
                "name": "Gertrude Ederle",
                "date": "25/12/2014",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "6",
                "name": "Gertrude Ederle",
                "date": "26/12/2014",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "6",
                "name": "Gertrude Ederle",
                "date": "26/12/2014",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "6",
                "name": "Gertrude Ederle",
                "date": "01/01/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "6",
                "name": "Gertrude Ederle",
                "date": "01/01/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "6",
                "name": "Gertrude Ederle",
                "date": "03/04/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "6",
                "name": "Gertrude Ederle",
                "date": "06/04/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "6",
                "name": "Gertrude Ederle",
                "date": "06/04/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "6",
                "name": "Gertrude Ederle",
                "date": "04/05/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "6",
                "name": "Gertrude Ederle",
                "date": "04/05/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "6",
                "name": "Gertrude Ederle",
                "date": "25/05/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "6",
                "name": "Gertrude Ederle",
                "date": "25/05/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "6",
                "name": "Gertrude Ederle",
                "date": "31/08/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "6",
                "name": "Gertrude Ederle",
                "date": "31/08/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "6",
                "name": "Gertrude Ederle",
                "date": "25/12/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "6",
                "name": "Gertrude Ederle",
                "date": "25/12/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "6",
                "name": "Gertrude Ederle",
                "date": "28/12/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "6",
                "name": "Gertrude Ederle",
                "date": "28/12/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "7",
                "name": "Amelia Gade Corson",
                "date": "25/12/2014",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "7",
                "name": "Amelia Gade Corson",
                "date": "25/12/2014",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "7",
                "name": "Amelia Gade Corson",
                "date": "26/12/2014",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "7",
                "name": "Amelia Gade Corson",
                "date": "26/12/2014",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "7",
                "name": "Amelia Gade Corson",
                "date": "01/01/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "7",
                "name": "Amelia Gade Corson",
                "date": "01/01/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "7",
                "name": "Amelia Gade Corson",
                "date": "03/04/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "7",
                "name": "Amelia Gade Corson",
                "date": "06/04/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "7",
                "name": "Amelia Gade Corson",
                "date": "06/04/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "7",
                "name": "Amelia Gade Corson",
                "date": "04/05/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "7",
                "name": "Amelia Gade Corson",
                "date": "04/05/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "7",
                "name": "Amelia Gade Corson",
                "date": "25/05/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "7",
                "name": "Amelia Gade Corson",
                "date": "25/05/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "7",
                "name": "Amelia Gade Corson",
                "date": "31/08/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "7",
                "name": "Amelia Gade Corson",
                "date": "31/08/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "7",
                "name": "Amelia Gade Corson",
                "date": "25/12/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "7",
                "name": "Amelia Gade Corson",
                "date": "25/12/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "7",
                "name": "Amelia Gade Corson",
                "date": "28/12/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "7",
                "name": "Amelia Gade Corson",
                "date": "28/12/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "8",
                "name": "Edward H. Temme",
                "date": "25/12/2014",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "8",
                "name": "Edward H. Temme",
                "date": "25/12/2014",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "8",
                "name": "Edward H. Temme",
                "date": "26/12/2014",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "8",
                "name": "Edward H. Temme",
                "date": "26/12/2014",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "8",
                "name": "Edward H. Temme",
                "date": "01/01/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "8",
                "name": "Edward H. Temme",
                "date": "01/01/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "8",
                "name": "Edward H. Temme",
                "date": "02/02/2015",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "8",
                "name": "Edward H. Temme",
                "date": "03/02/2015",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "8",
                "name": "Edward H. Temme",
                "date": "03/02/2015",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "8",
                "name": "Edward H. Temme",
                "date": "04/02/2015",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "8",
                "name": "Edward H. Temme",
                "date": "04/02/2015",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "8",
                "name": "Edward H. Temme",
                "date": "05/02/2015",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "8",
                "name": "Edward H. Temme",
                "date": "05/02/2015",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "8",
                "name": "Edward H. Temme",
                "date": "06/02/2015",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "8",
                "name": "Edward H. Temme",
                "date": "06/02/2015",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "8",
                "name": "Edward H. Temme",
                "date": "09/02/2015",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "8",
                "name": "Edward H. Temme",
                "date": "09/02/2015",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "8",
                "name": "Edward H. Temme",
                "date": "10/02/2015",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "8",
                "name": "Edward H. Temme",
                "date": "10/02/2015",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "8",
                "name": "Edward H. Temme",
                "date": "11/02/2015",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "8",
                "name": "Edward H. Temme",
                "date": "11/02/2015",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "8",
                "name": "Edward H. Temme",
                "date": "12/02/2015",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "8",
                "name": "Edward H. Temme",
                "date": "12/02/2015",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "8",
                "name": "Edward H. Temme",
                "date": "13/02/2015",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "8",
                "name": "Edward H. Temme",
                "date": "13/02/2015",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "8",
                "name": "Edward H. Temme",
                "date": "03/04/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "8",
                "name": "Edward H. Temme",
                "date": "06/04/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "8",
                "name": "Edward H. Temme",
                "date": "06/04/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "8",
                "name": "Edward H. Temme",
                "date": "04/05/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "8",
                "name": "Edward H. Temme",
                "date": "04/05/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "8",
                "name": "Edward H. Temme",
                "date": "25/05/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "8",
                "name": "Edward H. Temme",
                "date": "25/05/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "8",
                "name": "Edward H. Temme",
                "date": "31/08/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "8",
                "name": "Edward H. Temme",
                "date": "31/08/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "8",
                "name": "Edward H. Temme",
                "date": "25/12/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "8",
                "name": "Edward H. Temme",
                "date": "25/12/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "8",
                "name": "Edward H. Temme",
                "date": "28/12/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "8",
                "name": "Edward H. Temme",
                "date": "28/12/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "9",
                "name": "Florence Chadwick",
                "date": "25/12/2014",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "9",
                "name": "Florence Chadwick",
                "date": "25/12/2014",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "9",
                "name": "Florence Chadwick",
                "date": "26/12/2014",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "9",
                "name": "Florence Chadwick",
                "date": "26/12/2014",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "9",
                "name": "Florence Chadwick",
                "date": "01/01/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "9",
                "name": "Florence Chadwick",
                "date": "01/01/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "9",
                "name": "Florence Chadwick",
                "date": "03/04/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "9",
                "name": "Florence Chadwick",
                "date": "06/04/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "9",
                "name": "Florence Chadwick",
                "date": "06/04/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "9",
                "name": "Florence Chadwick",
                "date": "04/05/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "9",
                "name": "Florence Chadwick",
                "date": "04/05/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "9",
                "name": "Florence Chadwick",
                "date": "25/05/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "9",
                "name": "Florence Chadwick",
                "date": "25/05/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "9",
                "name": "Florence Chadwick",
                "date": "31/08/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "9",
                "name": "Florence Chadwick",
                "date": "31/08/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "9",
                "name": "Florence Chadwick",
                "date": "11/11/2015",
                "unit": "AM",
                "value": "T"
            },
            {
                "userid": "9",
                "name": "Florence Chadwick",
                "date": "11/11/2015",
                "unit": "PM",
                "value": "T"
            },
            {
                "userid": "9",
                "name": "Florence Chadwick",
                "date": "25/12/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "9",
                "name": "Florence Chadwick",
                "date": "25/12/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "9",
                "name": "Florence Chadwick",
                "date": "28/12/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "9",
                "name": "Florence Chadwick",
                "date": "28/12/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "10",
                "name": "Damian Piz· Beltran",
                "date": "27/10/2014",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "10",
                "name": "Damian Piz· Beltran",
                "date": "27/10/2014",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "10",
                "name": "Damian Piz· Beltran",
                "date": "28/10/2014",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "10",
                "name": "Damian Piz· Beltran",
                "date": "28/10/2014",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "10",
                "name": "Damian Piz· Beltran",
                "date": "29/10/2014",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "10",
                "name": "Damian Piz· Beltran",
                "date": "29/10/2014",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "10",
                "name": "Damian Piz· Beltran",
                "date": "30/10/2014",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "10",
                "name": "Damian Piz· Beltran",
                "date": "30/10/2014",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "10",
                "name": "Damian Piz· Beltran",
                "date": "31/10/2014",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "10",
                "name": "Damian Piz· Beltran",
                "date": "31/10/2014",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "10",
                "name": "Damian Piz· Beltran",
                "date": "25/12/2014",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "10",
                "name": "Damian Piz· Beltran",
                "date": "25/12/2014",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "10",
                "name": "Damian Piz· Beltran",
                "date": "26/12/2014",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "10",
                "name": "Damian Piz· Beltran",
                "date": "26/12/2014",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "10",
                "name": "Damian Piz· Beltran",
                "date": "01/01/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "10",
                "name": "Damian Piz· Beltran",
                "date": "01/01/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "10",
                "name": "Damian Piz· Beltran",
                "date": "03/04/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "10",
                "name": "Damian Piz· Beltran",
                "date": "06/04/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "10",
                "name": "Damian Piz· Beltran",
                "date": "06/04/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "10",
                "name": "Damian Piz· Beltran",
                "date": "04/05/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "10",
                "name": "Damian Piz· Beltran",
                "date": "04/05/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "10",
                "name": "Damian Piz· Beltran",
                "date": "25/05/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "10",
                "name": "Damian Piz· Beltran",
                "date": "25/05/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "10",
                "name": "Damian Piz· Beltran",
                "date": "31/08/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "10",
                "name": "Damian Piz· Beltran",
                "date": "31/08/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "10",
                "name": "Damian Piz· Beltran",
                "date": "11/11/2015",
                "unit": "AM",
                "value": "T"
            },
            {
                "userid": "10",
                "name": "Damian Piz· Beltran",
                "date": "11/11/2015",
                "unit": "PM",
                "value": "T"
            },
            {
                "userid": "10",
                "name": "Damian Piz· Beltran",
                "date": "25/12/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "10",
                "name": "Damian Piz· Beltran",
                "date": "25/12/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "10",
                "name": "Damian Piz· Beltran",
                "date": "28/12/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "10",
                "name": "Damian Piz· Beltran",
                "date": "28/12/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "11",
                "name": "Marilyn Bell",
                "date": "27/10/2014",
                "unit": "AM",
                "value": "T"
            },
            {
                "userid": "11",
                "name": "Marilyn Bell",
                "date": "27/10/2014",
                "unit": "PM",
                "value": "T"
            },
            {
                "userid": "11",
                "name": "Marilyn Bell",
                "date": "28/10/2014",
                "unit": "AM",
                "value": "T"
            },
            {
                "userid": "11",
                "name": "Marilyn Bell",
                "date": "28/10/2014",
                "unit": "PM",
                "value": "T"
            },
            {
                "userid": "11",
                "name": "Marilyn Bell",
                "date": "29/10/2014",
                "unit": "AM",
                "value": "T"
            },
            {
                "userid": "11",
                "name": "Marilyn Bell",
                "date": "29/10/2014",
                "unit": "PM",
                "value": "T"
            },
            {
                "userid": "11",
                "name": "Marilyn Bell",
                "date": "30/10/2014",
                "unit": "AM",
                "value": "T"
            },
            {
                "userid": "11",
                "name": "Marilyn Bell",
                "date": "30/10/2014",
                "unit": "PM",
                "value": "T"
            },
            {
                "userid": "11",
                "name": "Marilyn Bell",
                "date": "31/10/2014",
                "unit": "AM",
                "value": "T"
            },
            {
                "userid": "11",
                "name": "Marilyn Bell",
                "date": "31/10/2014",
                "unit": "PM",
                "value": "T"
            },
            {
                "userid": "11",
                "name": "Marilyn Bell",
                "date": "03/11/2014",
                "unit": "AM",
                "value": "T"
            },
            {
                "userid": "11",
                "name": "Marilyn Bell",
                "date": "03/11/2014",
                "unit": "PM",
                "value": "T"
            },
            {
                "userid": "11",
                "name": "Marilyn Bell",
                "date": "04/11/2014",
                "unit": "AM",
                "value": "T"
            },
            {
                "userid": "11",
                "name": "Marilyn Bell",
                "date": "04/11/2014",
                "unit": "PM",
                "value": "T"
            },
            {
                "userid": "11",
                "name": "Marilyn Bell",
                "date": "05/11/2014",
                "unit": "AM",
                "value": "T"
            },
            {
                "userid": "11",
                "name": "Marilyn Bell",
                "date": "05/11/2014",
                "unit": "PM",
                "value": "T"
            },
            {
                "userid": "11",
                "name": "Marilyn Bell",
                "date": "06/11/2014",
                "unit": "AM",
                "value": "T"
            },
            {
                "userid": "11",
                "name": "Marilyn Bell",
                "date": "06/11/2014",
                "unit": "PM",
                "value": "T"
            },
            {
                "userid": "11",
                "name": "Marilyn Bell",
                "date": "07/11/2014",
                "unit": "AM",
                "value": "T"
            },
            {
                "userid": "11",
                "name": "Marilyn Bell",
                "date": "07/11/2014",
                "unit": "PM",
                "value": "T"
            },
            {
                "userid": "11",
                "name": "Marilyn Bell",
                "date": "10/11/2014",
                "unit": "AM",
                "value": "T"
            },
            {
                "userid": "11",
                "name": "Marilyn Bell",
                "date": "10/11/2014",
                "unit": "PM",
                "value": "T"
            },
            {
                "userid": "11",
                "name": "Marilyn Bell",
                "date": "11/11/2014",
                "unit": "AM",
                "value": "T"
            },
            {
                "userid": "11",
                "name": "Marilyn Bell",
                "date": "11/11/2014",
                "unit": "PM",
                "value": "T"
            },
            {
                "userid": "11",
                "name": "Marilyn Bell",
                "date": "12/11/2014",
                "unit": "AM",
                "value": "T"
            },
            {
                "userid": "11",
                "name": "Marilyn Bell",
                "date": "12/11/2014",
                "unit": "PM",
                "value": "T"
            },
            {
                "userid": "11",
                "name": "Marilyn Bell",
                "date": "13/11/2014",
                "unit": "AM",
                "value": "T"
            },
            {
                "userid": "11",
                "name": "Marilyn Bell",
                "date": "13/11/2014",
                "unit": "PM",
                "value": "T"
            },
            {
                "userid": "11",
                "name": "Marilyn Bell",
                "date": "14/11/2014",
                "unit": "AM",
                "value": "T"
            },
            {
                "userid": "11",
                "name": "Marilyn Bell",
                "date": "14/11/2014",
                "unit": "PM",
                "value": "T"
            },
            {
                "userid": "11",
                "name": "Marilyn Bell",
                "date": "17/11/2014",
                "unit": "AM",
                "value": "T"
            },
            {
                "userid": "11",
                "name": "Marilyn Bell",
                "date": "17/11/2014",
                "unit": "PM",
                "value": "T"
            },
            {
                "userid": "11",
                "name": "Marilyn Bell",
                "date": "18/11/2014",
                "unit": "AM",
                "value": "T"
            },
            {
                "userid": "11",
                "name": "Marilyn Bell",
                "date": "18/11/2014",
                "unit": "PM",
                "value": "T"
            },
            {
                "userid": "11",
                "name": "Marilyn Bell",
                "date": "19/11/2014",
                "unit": "AM",
                "value": "T"
            },
            {
                "userid": "11",
                "name": "Marilyn Bell",
                "date": "19/11/2014",
                "unit": "PM",
                "value": "T"
            },
            {
                "userid": "11",
                "name": "Marilyn Bell",
                "date": "20/11/2014",
                "unit": "AM",
                "value": "T"
            },
            {
                "userid": "11",
                "name": "Marilyn Bell",
                "date": "20/11/2014",
                "unit": "PM",
                "value": "T"
            },
            {
                "userid": "11",
                "name": "Marilyn Bell",
                "date": "21/11/2014",
                "unit": "AM",
                "value": "T"
            },
            {
                "userid": "11",
                "name": "Marilyn Bell",
                "date": "21/11/2014",
                "unit": "PM",
                "value": "T"
            },
            {
                "userid": "11",
                "name": "Marilyn Bell",
                "date": "24/11/2014",
                "unit": "AM",
                "value": "T"
            },
            {
                "userid": "11",
                "name": "Marilyn Bell",
                "date": "24/11/2014",
                "unit": "PM",
                "value": "T"
            },
            {
                "userid": "11",
                "name": "Marilyn Bell",
                "date": "25/11/2014",
                "unit": "AM",
                "value": "T"
            },
            {
                "userid": "11",
                "name": "Marilyn Bell",
                "date": "25/11/2014",
                "unit": "PM",
                "value": "T"
            },
            {
                "userid": "11",
                "name": "Marilyn Bell",
                "date": "26/11/2014",
                "unit": "AM",
                "value": "T"
            },
            {
                "userid": "11",
                "name": "Marilyn Bell",
                "date": "26/11/2014",
                "unit": "PM",
                "value": "T"
            },
            {
                "userid": "11",
                "name": "Marilyn Bell",
                "date": "27/11/2014",
                "unit": "AM",
                "value": "T"
            },
            {
                "userid": "11",
                "name": "Marilyn Bell",
                "date": "27/11/2014",
                "unit": "PM",
                "value": "T"
            },
            {
                "userid": "11",
                "name": "Marilyn Bell",
                "date": "28/11/2014",
                "unit": "AM",
                "value": "T"
            },
            {
                "userid": "11",
                "name": "Marilyn Bell",
                "date": "28/11/2014",
                "unit": "PM",
                "value": "T"
            },
            {
                "userid": "11",
                "name": "Marilyn Bell",
                "date": "25/12/2014",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "11",
                "name": "Marilyn Bell",
                "date": "25/12/2014",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "11",
                "name": "Marilyn Bell",
                "date": "26/12/2014",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "11",
                "name": "Marilyn Bell",
                "date": "26/12/2014",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "11",
                "name": "Marilyn Bell",
                "date": "01/01/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "11",
                "name": "Marilyn Bell",
                "date": "01/01/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "11",
                "name": "Marilyn Bell",
                "date": "03/04/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "11",
                "name": "Marilyn Bell",
                "date": "06/04/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "11",
                "name": "Marilyn Bell",
                "date": "06/04/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "11",
                "name": "Marilyn Bell",
                "date": "04/05/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "11",
                "name": "Marilyn Bell",
                "date": "04/05/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "11",
                "name": "Marilyn Bell",
                "date": "25/05/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "11",
                "name": "Marilyn Bell",
                "date": "25/05/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "11",
                "name": "Marilyn Bell",
                "date": "31/08/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "11",
                "name": "Marilyn Bell",
                "date": "31/08/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "11",
                "name": "Marilyn Bell",
                "date": "11/11/2015",
                "unit": "AM",
                "value": "T"
            },
            {
                "userid": "11",
                "name": "Marilyn Bell",
                "date": "11/11/2015",
                "unit": "PM",
                "value": "T"
            },
            {
                "userid": "11",
                "name": "Marilyn Bell",
                "date": "25/12/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "11",
                "name": "Marilyn Bell",
                "date": "25/12/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "11",
                "name": "Marilyn Bell",
                "date": "28/12/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "11",
                "name": "Marilyn Bell",
                "date": "28/12/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "12",
                "name": "Brojen Das",
                "date": "23/12/2014",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "12",
                "name": "Brojen Das",
                "date": "23/12/2014",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "12",
                "name": "Brojen Das",
                "date": "24/12/2014",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "12",
                "name": "Brojen Das",
                "date": "24/12/2014",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "12",
                "name": "Brojen Das",
                "date": "25/12/2014",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "12",
                "name": "Brojen Das",
                "date": "25/12/2014",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "12",
                "name": "Brojen Das",
                "date": "26/12/2014",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "12",
                "name": "Brojen Das",
                "date": "26/12/2014",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "12",
                "name": "Brojen Das",
                "date": "01/01/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "12",
                "name": "Brojen Das",
                "date": "01/01/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "12",
                "name": "Brojen Das",
                "date": "03/04/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "12",
                "name": "Brojen Das",
                "date": "06/04/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "12",
                "name": "Brojen Das",
                "date": "06/04/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "12",
                "name": "Brojen Das",
                "date": "04/05/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "12",
                "name": "Brojen Das",
                "date": "04/05/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "12",
                "name": "Brojen Das",
                "date": "25/05/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "12",
                "name": "Brojen Das",
                "date": "25/05/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "12",
                "name": "Brojen Das",
                "date": "31/08/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "12",
                "name": "Brojen Das",
                "date": "31/08/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "12",
                "name": "Brojen Das",
                "date": "25/12/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "12",
                "name": "Brojen Das",
                "date": "25/12/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "12",
                "name": "Brojen Das",
                "date": "28/12/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "12",
                "name": "Brojen Das",
                "date": "28/12/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "13",
                "name": "Arati Saha",
                "date": "22/12/2014",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "13",
                "name": "Arati Saha",
                "date": "22/12/2014",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "13",
                "name": "Arati Saha",
                "date": "23/12/2014",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "13",
                "name": "Arati Saha",
                "date": "23/12/2014",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "13",
                "name": "Arati Saha",
                "date": "24/12/2014",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "13",
                "name": "Arati Saha",
                "date": "24/12/2014",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "13",
                "name": "Arati Saha",
                "date": "25/12/2014",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "13",
                "name": "Arati Saha",
                "date": "25/12/2014",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "13",
                "name": "Arati Saha",
                "date": "26/12/2014",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "13",
                "name": "Arati Saha",
                "date": "26/12/2014",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "13",
                "name": "Arati Saha",
                "date": "01/01/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "13",
                "name": "Arati Saha",
                "date": "01/01/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "13",
                "name": "Arati Saha",
                "date": "03/04/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "13",
                "name": "Arati Saha",
                "date": "06/04/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "13",
                "name": "Arati Saha",
                "date": "06/04/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "13",
                "name": "Arati Saha",
                "date": "04/05/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "13",
                "name": "Arati Saha",
                "date": "04/05/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "13",
                "name": "Arati Saha",
                "date": "25/05/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "13",
                "name": "Arati Saha",
                "date": "25/05/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "13",
                "name": "Arati Saha",
                "date": "31/08/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "13",
                "name": "Arati Saha",
                "date": "31/08/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "13",
                "name": "Arati Saha",
                "date": "11/11/2015",
                "unit": "AM",
                "value": "T"
            },
            {
                "userid": "13",
                "name": "Arati Saha",
                "date": "11/11/2015",
                "unit": "PM",
                "value": "T"
            },
            {
                "userid": "13",
                "name": "Arati Saha",
                "date": "25/12/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "13",
                "name": "Arati Saha",
                "date": "25/12/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "13",
                "name": "Arati Saha",
                "date": "28/12/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "13",
                "name": "Arati Saha",
                "date": "28/12/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "14",
                "name": "Mihir Sen",
                "date": "22/12/2014",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "14",
                "name": "Mihir Sen",
                "date": "22/12/2014",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "14",
                "name": "Mihir Sen",
                "date": "23/12/2014",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "14",
                "name": "Mihir Sen",
                "date": "23/12/2014",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "14",
                "name": "Mihir Sen",
                "date": "24/12/2014",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "14",
                "name": "Mihir Sen",
                "date": "24/12/2014",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "14",
                "name": "Mihir Sen",
                "date": "25/12/2014",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "14",
                "name": "Mihir Sen",
                "date": "25/12/2014",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "14",
                "name": "Mihir Sen",
                "date": "26/12/2014",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "14",
                "name": "Mihir Sen",
                "date": "26/12/2014",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "14",
                "name": "Mihir Sen",
                "date": "01/01/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "14",
                "name": "Mihir Sen",
                "date": "01/01/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "14",
                "name": "Mihir Sen",
                "date": "03/04/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "14",
                "name": "Mihir Sen",
                "date": "06/04/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "14",
                "name": "Mihir Sen",
                "date": "06/04/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "14",
                "name": "Mihir Sen",
                "date": "04/05/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "14",
                "name": "Mihir Sen",
                "date": "04/05/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "14",
                "name": "Mihir Sen",
                "date": "25/05/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "14",
                "name": "Mihir Sen",
                "date": "25/05/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "14",
                "name": "Mihir Sen",
                "date": "31/08/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "14",
                "name": "Mihir Sen",
                "date": "31/08/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "14",
                "name": "Mihir Sen",
                "date": "11/11/2015",
                "unit": "AM",
                "value": "T"
            },
            {
                "userid": "14",
                "name": "Mihir Sen",
                "date": "11/11/2015",
                "unit": "PM",
                "value": "T"
            },
            {
                "userid": "14",
                "name": "Mihir Sen",
                "date": "25/12/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "14",
                "name": "Mihir Sen",
                "date": "25/12/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "14",
                "name": "Mihir Sen",
                "date": "28/12/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "14",
                "name": "Mihir Sen",
                "date": "28/12/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "15",
                "name": "Antonio Abertondo",
                "date": "22/12/2014",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "15",
                "name": "Antonio Abertondo",
                "date": "22/12/2014",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "15",
                "name": "Antonio Abertondo",
                "date": "23/12/2014",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "15",
                "name": "Antonio Abertondo",
                "date": "23/12/2014",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "15",
                "name": "Antonio Abertondo",
                "date": "24/12/2014",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "15",
                "name": "Antonio Abertondo",
                "date": "24/12/2014",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "15",
                "name": "Antonio Abertondo",
                "date": "25/12/2014",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "15",
                "name": "Antonio Abertondo",
                "date": "25/12/2014",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "15",
                "name": "Antonio Abertondo",
                "date": "26/12/2014",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "15",
                "name": "Antonio Abertondo",
                "date": "26/12/2014",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "15",
                "name": "Antonio Abertondo",
                "date": "01/01/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "15",
                "name": "Antonio Abertondo",
                "date": "01/01/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "15",
                "name": "Antonio Abertondo",
                "date": "03/04/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "15",
                "name": "Antonio Abertondo",
                "date": "06/04/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "15",
                "name": "Antonio Abertondo",
                "date": "06/04/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "15",
                "name": "Antonio Abertondo",
                "date": "04/05/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "15",
                "name": "Antonio Abertondo",
                "date": "04/05/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "15",
                "name": "Antonio Abertondo",
                "date": "25/05/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "15",
                "name": "Antonio Abertondo",
                "date": "25/05/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "15",
                "name": "Antonio Abertondo",
                "date": "31/08/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "15",
                "name": "Antonio Abertondo",
                "date": "31/08/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "15",
                "name": "Antonio Abertondo",
                "date": "25/12/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "15",
                "name": "Antonio Abertondo",
                "date": "25/12/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "15",
                "name": "Antonio Abertondo",
                "date": "28/12/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "15",
                "name": "Antonio Abertondo",
                "date": "28/12/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "16",
                "name": "Jon Erikson",
                "date": "22/12/2014",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "16",
                "name": "Jon Erikson",
                "date": "22/12/2014",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "16",
                "name": "Jon Erikson",
                "date": "23/12/2014",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "16",
                "name": "Jon Erikson",
                "date": "23/12/2014",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "16",
                "name": "Jon Erikson",
                "date": "24/12/2014",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "16",
                "name": "Jon Erikson",
                "date": "24/12/2014",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "16",
                "name": "Jon Erikson",
                "date": "25/12/2014",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "16",
                "name": "Jon Erikson",
                "date": "25/12/2014",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "16",
                "name": "Jon Erikson",
                "date": "26/12/2014",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "16",
                "name": "Jon Erikson",
                "date": "26/12/2014",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "16",
                "name": "Jon Erikson",
                "date": "01/01/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "16",
                "name": "Jon Erikson",
                "date": "01/01/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "16",
                "name": "Jon Erikson",
                "date": "03/04/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "16",
                "name": "Jon Erikson",
                "date": "06/04/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "16",
                "name": "Jon Erikson",
                "date": "06/04/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "16",
                "name": "Jon Erikson",
                "date": "04/05/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "16",
                "name": "Jon Erikson",
                "date": "04/05/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "16",
                "name": "Jon Erikson",
                "date": "25/05/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "16",
                "name": "Jon Erikson",
                "date": "25/05/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "16",
                "name": "Jon Erikson",
                "date": "31/08/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "16",
                "name": "Jon Erikson",
                "date": "31/08/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "16",
                "name": "Jon Erikson",
                "date": "25/12/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "16",
                "name": "Jon Erikson",
                "date": "25/12/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "16",
                "name": "Jon Erikson",
                "date": "28/12/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "16",
                "name": "Jon Erikson",
                "date": "28/12/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "17",
                "name": "John Maclean",
                "date": "27/10/2014",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "17",
                "name": "John Maclean",
                "date": "27/10/2014",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "17",
                "name": "John Maclean",
                "date": "28/10/2014",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "17",
                "name": "John Maclean",
                "date": "28/10/2014",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "17",
                "name": "John Maclean",
                "date": "29/10/2014",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "17",
                "name": "John Maclean",
                "date": "29/10/2014",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "17",
                "name": "John Maclean",
                "date": "03/11/2014",
                "unit": "AM",
                "value": "T"
            },
            {
                "userid": "17",
                "name": "John Maclean",
                "date": "03/11/2014",
                "unit": "PM",
                "value": "T"
            },
            {
                "userid": "17",
                "name": "John Maclean",
                "date": "22/12/2014",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "17",
                "name": "John Maclean",
                "date": "22/12/2014",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "17",
                "name": "John Maclean",
                "date": "23/12/2014",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "17",
                "name": "John Maclean",
                "date": "23/12/2014",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "17",
                "name": "John Maclean",
                "date": "24/12/2014",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "17",
                "name": "John Maclean",
                "date": "24/12/2014",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "17",
                "name": "John Maclean",
                "date": "25/12/2014",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "17",
                "name": "John Maclean",
                "date": "25/12/2014",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "17",
                "name": "John Maclean",
                "date": "26/12/2014",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "17",
                "name": "John Maclean",
                "date": "26/12/2014",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "17",
                "name": "John Maclean",
                "date": "01/01/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "17",
                "name": "John Maclean",
                "date": "01/01/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "17",
                "name": "John Maclean",
                "date": "03/04/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "17",
                "name": "John Maclean",
                "date": "06/04/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "17",
                "name": "John Maclean",
                "date": "06/04/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "17",
                "name": "John Maclean",
                "date": "04/05/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "17",
                "name": "John Maclean",
                "date": "04/05/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "17",
                "name": "John Maclean",
                "date": "25/05/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "17",
                "name": "John Maclean",
                "date": "25/05/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "17",
                "name": "John Maclean",
                "date": "31/08/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "17",
                "name": "John Maclean",
                "date": "31/08/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "17",
                "name": "John Maclean",
                "date": "25/12/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "17",
                "name": "John Maclean",
                "date": "25/12/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "17",
                "name": "John Maclean",
                "date": "28/12/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "17",
                "name": "John Maclean",
                "date": "28/12/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "18",
                "name": "Philippe Croizon",
                "date": "27/10/2014",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "18",
                "name": "Philippe Croizon",
                "date": "27/10/2014",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "18",
                "name": "Philippe Croizon",
                "date": "28/10/2014",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "18",
                "name": "Philippe Croizon",
                "date": "28/10/2014",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "18",
                "name": "Philippe Croizon",
                "date": "29/10/2014",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "18",
                "name": "Philippe Croizon",
                "date": "29/10/2014",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "18",
                "name": "Philippe Croizon",
                "date": "30/10/2014",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "18",
                "name": "Philippe Croizon",
                "date": "30/10/2014",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "18",
                "name": "Philippe Croizon",
                "date": "31/10/2014",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "18",
                "name": "Philippe Croizon",
                "date": "31/10/2014",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "18",
                "name": "Philippe Croizon",
                "date": "25/12/2014",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "18",
                "name": "Philippe Croizon",
                "date": "25/12/2014",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "18",
                "name": "Philippe Croizon",
                "date": "26/12/2014",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "18",
                "name": "Philippe Croizon",
                "date": "26/12/2014",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "18",
                "name": "Philippe Croizon",
                "date": "01/01/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "18",
                "name": "Philippe Croizon",
                "date": "01/01/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "18",
                "name": "Philippe Croizon",
                "date": "03/04/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "18",
                "name": "Philippe Croizon",
                "date": "06/04/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "18",
                "name": "Philippe Croizon",
                "date": "06/04/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "18",
                "name": "Philippe Croizon",
                "date": "04/05/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "18",
                "name": "Philippe Croizon",
                "date": "04/05/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "18",
                "name": "Philippe Croizon",
                "date": "25/05/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "18",
                "name": "Philippe Croizon",
                "date": "25/05/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "18",
                "name": "Philippe Croizon",
                "date": "31/08/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "18",
                "name": "Philippe Croizon",
                "date": "31/08/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "18",
                "name": "Philippe Croizon",
                "date": "11/11/2015",
                "unit": "AM",
                "value": "T"
            },
            {
                "userid": "18",
                "name": "Philippe Croizon",
                "date": "11/11/2015",
                "unit": "PM",
                "value": "T"
            },
            {
                "userid": "18",
                "name": "Philippe Croizon",
                "date": "25/12/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "18",
                "name": "Philippe Croizon",
                "date": "25/12/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "18",
                "name": "Philippe Croizon",
                "date": "28/12/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "18",
                "name": "Philippe Croizon",
                "date": "28/12/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "19",
                "name": "Trent Grimsey",
                "date": "25/12/2014",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "19",
                "name": "Trent Grimsey",
                "date": "25/12/2014",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "19",
                "name": "Trent Grimsey",
                "date": "26/12/2014",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "19",
                "name": "Trent Grimsey",
                "date": "26/12/2014",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "19",
                "name": "Trent Grimsey",
                "date": "01/01/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "19",
                "name": "Trent Grimsey",
                "date": "01/01/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "19",
                "name": "Trent Grimsey",
                "date": "03/04/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "19",
                "name": "Trent Grimsey",
                "date": "06/04/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "19",
                "name": "Trent Grimsey",
                "date": "06/04/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "19",
                "name": "Trent Grimsey",
                "date": "04/05/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "19",
                "name": "Trent Grimsey",
                "date": "04/05/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "19",
                "name": "Trent Grimsey",
                "date": "25/05/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "19",
                "name": "Trent Grimsey",
                "date": "25/05/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "19",
                "name": "Trent Grimsey",
                "date": "31/08/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "19",
                "name": "Trent Grimsey",
                "date": "31/08/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "19",
                "name": "Trent Grimsey",
                "date": "25/12/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "19",
                "name": "Trent Grimsey",
                "date": "25/12/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "19",
                "name": "Trent Grimsey",
                "date": "28/12/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "19",
                "name": "Trent Grimsey",
                "date": "28/12/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "20",
                "name": "Philip Rush",
                "date": "27/10/2014",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "20",
                "name": "Philip Rush",
                "date": "27/10/2014",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "20",
                "name": "Philip Rush",
                "date": "28/10/2014",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "20",
                "name": "Philip Rush",
                "date": "28/10/2014",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "20",
                "name": "Philip Rush",
                "date": "29/10/2014",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "20",
                "name": "Philip Rush",
                "date": "29/10/2014",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "20",
                "name": "Philip Rush",
                "date": "30/10/2014",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "20",
                "name": "Philip Rush",
                "date": "30/10/2014",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "20",
                "name": "Philip Rush",
                "date": "31/10/2014",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "20",
                "name": "Philip Rush",
                "date": "31/10/2014",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "20",
                "name": "Philip Rush",
                "date": "25/12/2014",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "20",
                "name": "Philip Rush",
                "date": "25/12/2014",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "20",
                "name": "Philip Rush",
                "date": "26/12/2014",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "20",
                "name": "Philip Rush",
                "date": "26/12/2014",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "20",
                "name": "Philip Rush",
                "date": "01/01/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "20",
                "name": "Philip Rush",
                "date": "01/01/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "20",
                "name": "Philip Rush",
                "date": "03/04/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "20",
                "name": "Philip Rush",
                "date": "06/04/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "20",
                "name": "Philip Rush",
                "date": "06/04/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "20",
                "name": "Philip Rush",
                "date": "04/05/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "20",
                "name": "Philip Rush",
                "date": "04/05/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "20",
                "name": "Philip Rush",
                "date": "25/05/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "20",
                "name": "Philip Rush",
                "date": "25/05/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "20",
                "name": "Philip Rush",
                "date": "31/08/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "20",
                "name": "Philip Rush",
                "date": "31/08/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "20",
                "name": "Philip Rush",
                "date": "11/11/2015",
                "unit": "AM",
                "value": "T"
            },
            {
                "userid": "20",
                "name": "Philip Rush",
                "date": "11/11/2015",
                "unit": "PM",
                "value": "T"
            },
            {
                "userid": "20",
                "name": "Philip Rush",
                "date": "25/12/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "20",
                "name": "Philip Rush",
                "date": "25/12/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "20",
                "name": "Philip Rush",
                "date": "28/12/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "20",
                "name": "Philip Rush",
                "date": "28/12/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "21",
                "name": "Kevin Murphy",
                "date": "03/11/2014",
                "unit": "AM",
                "value": "T"
            },
            {
                "userid": "21",
                "name": "Kevin Murphy",
                "date": "03/11/2014",
                "unit": "PM",
                "value": "T"
            },
            {
                "userid": "21",
                "name": "Kevin Murphy",
                "date": "25/12/2014",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "21",
                "name": "Kevin Murphy",
                "date": "25/12/2014",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "21",
                "name": "Kevin Murphy",
                "date": "26/12/2014",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "21",
                "name": "Kevin Murphy",
                "date": "26/12/2014",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "21",
                "name": "Kevin Murphy",
                "date": "01/01/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "21",
                "name": "Kevin Murphy",
                "date": "01/01/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "21",
                "name": "Kevin Murphy",
                "date": "03/04/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "21",
                "name": "Kevin Murphy",
                "date": "06/04/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "21",
                "name": "Kevin Murphy",
                "date": "06/04/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "21",
                "name": "Kevin Murphy",
                "date": "04/05/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "21",
                "name": "Kevin Murphy",
                "date": "04/05/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "21",
                "name": "Kevin Murphy",
                "date": "25/05/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "21",
                "name": "Kevin Murphy",
                "date": "25/05/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "21",
                "name": "Kevin Murphy",
                "date": "31/08/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "21",
                "name": "Kevin Murphy",
                "date": "31/08/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "21",
                "name": "Kevin Murphy",
                "date": "25/12/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "21",
                "name": "Kevin Murphy",
                "date": "25/12/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "21",
                "name": "Kevin Murphy",
                "date": "28/12/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "21",
                "name": "Kevin Murphy",
                "date": "28/12/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "22",
                "name": "Alison Streeter",
                "date": "03/11/2014",
                "unit": "AM",
                "value": "T"
            },
            {
                "userid": "22",
                "name": "Alison Streeter",
                "date": "03/11/2014",
                "unit": "PM",
                "value": "T"
            },
            {
                "userid": "22",
                "name": "Alison Streeter",
                "date": "25/12/2014",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "22",
                "name": "Alison Streeter",
                "date": "25/12/2014",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "22",
                "name": "Alison Streeter",
                "date": "26/12/2014",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "22",
                "name": "Alison Streeter",
                "date": "26/12/2014",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "22",
                "name": "Alison Streeter",
                "date": "01/01/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "22",
                "name": "Alison Streeter",
                "date": "01/01/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "22",
                "name": "Alison Streeter",
                "date": "03/04/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "22",
                "name": "Alison Streeter",
                "date": "06/04/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "22",
                "name": "Alison Streeter",
                "date": "06/04/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "22",
                "name": "Alison Streeter",
                "date": "04/05/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "22",
                "name": "Alison Streeter",
                "date": "04/05/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "22",
                "name": "Alison Streeter",
                "date": "25/05/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "22",
                "name": "Alison Streeter",
                "date": "25/05/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "22",
                "name": "Alison Streeter",
                "date": "31/08/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "22",
                "name": "Alison Streeter",
                "date": "31/08/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "22",
                "name": "Alison Streeter",
                "date": "25/12/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "22",
                "name": "Alison Streeter",
                "date": "25/12/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "22",
                "name": "Alison Streeter",
                "date": "28/12/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "22",
                "name": "Alison Streeter",
                "date": "28/12/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "23",
                "name": "Cynthia Nicholas",
                "date": "27/10/2014",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "23",
                "name": "Cynthia Nicholas",
                "date": "27/10/2014",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "23",
                "name": "Cynthia Nicholas",
                "date": "28/10/2014",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "23",
                "name": "Cynthia Nicholas",
                "date": "28/10/2014",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "23",
                "name": "Cynthia Nicholas",
                "date": "29/10/2014",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "23",
                "name": "Cynthia Nicholas",
                "date": "29/10/2014",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "23",
                "name": "Cynthia Nicholas",
                "date": "30/10/2014",
                "unit": "AM",
                "value": "V"
            },
            {
                "userid": "23",
                "name": "Cynthia Nicholas",
                "date": "30/10/2014",
                "unit": "PM",
                "value": "V"
            },
            {
                "userid": "23",
                "name": "Cynthia Nicholas",
                "date": "25/12/2014",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "23",
                "name": "Cynthia Nicholas",
                "date": "25/12/2014",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "23",
                "name": "Cynthia Nicholas",
                "date": "26/12/2014",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "23",
                "name": "Cynthia Nicholas",
                "date": "26/12/2014",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "23",
                "name": "Cynthia Nicholas",
                "date": "01/01/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "23",
                "name": "Cynthia Nicholas",
                "date": "01/01/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "23",
                "name": "Cynthia Nicholas",
                "date": "03/04/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "23",
                "name": "Cynthia Nicholas",
                "date": "06/04/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "23",
                "name": "Cynthia Nicholas",
                "date": "06/04/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "23",
                "name": "Cynthia Nicholas",
                "date": "04/05/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "23",
                "name": "Cynthia Nicholas",
                "date": "04/05/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "23",
                "name": "Cynthia Nicholas",
                "date": "25/05/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "23",
                "name": "Cynthia Nicholas",
                "date": "25/05/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "23",
                "name": "Cynthia Nicholas",
                "date": "31/08/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "23",
                "name": "Cynthia Nicholas",
                "date": "31/08/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "23",
                "name": "Cynthia Nicholas",
                "date": "11/11/2015",
                "unit": "AM",
                "value": "T"
            },
            {
                "userid": "23",
                "name": "Cynthia Nicholas",
                "date": "11/11/2015",
                "unit": "PM",
                "value": "T"
            },
            {
                "userid": "23",
                "name": "Cynthia Nicholas",
                "date": "25/12/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "23",
                "name": "Cynthia Nicholas",
                "date": "25/12/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": "23",
                "name": "Cynthia Nicholas",
                "date": "28/12/2015",
                "unit": "PM",
                "value": "P"
            },
            {
                "userid": "23",
                "name": "Cynthia Nicholas",
                "date": "28/12/2015",
                "unit": "AM",
                "value": "P"
            },
            {
                "userid": ""
            }
        ]
    }
})
