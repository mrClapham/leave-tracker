/** @jsx React.DOM */
var Calendar = React.createClass({displayName: "Calendar",
    propTypes: {
        alldata : React.PropTypes.array,
        dates : React.PropTypes.array.isRequired,
        sublist : React.PropTypes.array,
        daysoff : React.PropTypes.array,
        sublistfunc : React.PropTypes.func,
        worker : React.PropTypes.string,
        key:React.PropTypes.number
    },

    dataByDate: function(array, value ){
        return _.filter(array, function(n){
            if(!n.jsDate){
                return false
            } else{
                return  String(n.jsDate) == String(value)
            }
        })
    },

    render: function() {
        var _this = this;
        console.log("THE WORKER TEST ",this.props.worker)
        console.log("ALL DATA :",this.props.alldata)
        return (React.createElement("div", null, 
        React.createElement("h1", null, "Date ", this.props.worker, " "), 
        React.createElement("h1", null, "Date ", this.props.dates[0].getFullYear(), " "), 
            React.createElement("ul", {className: "date-list"}, 
             this.props.dates.map(function(e, i){

                //console.log(_this.props.sublistfunc(e))
                //console.log("Calendar i ",i)
               // console.log("Calendar e ",e)
                    var _i = i;
                var _dateData = _this.dataByDate(_this.props.alldata, e);
                console.log("The _i value is ",_i);
                console.log("_dateData", _dateData);
                console.log("_dateData", _dateData);

                return (React.createElement("li", {className: "date-cells"}, React.createElement("p", null, String(e)), React.createElement(CalendarCell, {staticTester: "Just testing", key: "_i", dateArray: _dateData})))
                }) 
                )
        ));
    }
});
AppMain.value('Calendar', Calendar);


var CalendarCell = React.createClass({displayName: "CalendarCell",
    propTypes: {
        dateArray : React.PropTypes.array.isRequired,
        key : React.PropTypes.number,
        staticTester : React.PropTypes.string
    },

    addHello:function(string){
        console.log()
        return string+" CalendarCell."
    },

    render: function() {
        console.log("CalendarCell key : ", this.props.key)
        console.log("CalendarCell dateArray : ", this.props.dateArray)
        console.log("CalendarCell staticTester : ", this.props.staticTester)
        return (React.createElement("ul", {classname: "individual-leave-cell"}, this.addHello("helloo "), " ", this.props.dateArray.map(function(n){return React.createElement(WorkerLeaveCell, {key: n.key, data: n}) })));
    }
});
AppMain.value('CalendarCell', CalendarCell);

var WorkerLeaveCell = React.createClass({displayName: "WorkerLeaveCell",
    propTypes: {
        key : React.PropTypes.number,
        data : React.PropTypes.object
    },
    render: function() {
        /*
         key: 42
         name: "Matthew Webb"
         unit: "PM"
         userid: "1"
         value: "P"
         */
        return (React.createElement("li", {classname: "leave-list-item"}, 
                    React.createElement("p", null, "I am ", this.props.data.name)
                ));
    }
});
AppMain.value('WorkerLeaveCell', WorkerLeaveCell);
