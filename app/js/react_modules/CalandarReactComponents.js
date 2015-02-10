/** @jsx React.DOM */
var Calendar = React.createClass({displayName: "Calendar",
    propTypes: {
        allData : React.PropTypes.array,
        dates : React.PropTypes.array.isRequired,
        sublist : React.PropTypes.array,
        daysoff : React.PropTypes.array,
        sublistfunc : React.PropTypes.func
    },

    render: function() {
        var _this = this;
//        console.log(this.props.sublist)
        console.log("ALL DATA :",this.props.allData)
        return (React.createElement("div", null, 
        React.createElement("h1", null, "Date ", this.props.worker, " "), 
        React.createElement("h1", null, "Date ", this.props.dates[0].getFullYear(), " "), 
            React.createElement("ul", {className: "date-list"}, 
             this.props.dates.map(function(e, i){

                console.log(_this.props.sublistfunc(e))
                console.log("Calendar i ",i)
                console.log("Calendar e ",e)

                return (React.createElement("li", {className: "date-cells"}, React.createElement("p", null, String(e)), React.createElement(CalendarCell, {key: i, dateArray: _this.props.sublistfunc(e) || []})))
                }) 
                )
        ));
    }
});
AppMain.value('Calendar', Calendar);


var CalendarCell = React.createClass({displayName: "CalendarCell",
    propTypes: {
        dateArray : React.PropTypes.array.isRequired,
        key : React.PropTypes.number.isRequired
    },

    render: function() {
        return (React.createElement("ul", {classname: "individual-leave-cell"}, this.props.dateArray.map(function(n){return React.createElement(WorkerLeaveCell, {key: n.key, data: n}) })));
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
