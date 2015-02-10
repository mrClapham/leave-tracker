/** @jsx React.DOM */
var Calendar = React.createClass({displayName: "Calendar",
    propTypes: {
        dates : React.PropTypes.array.isRequired,
        sublist : React.PropTypes.array,
        daysoff : React.PropTypes.array,
        sublistfunc : React.PropTypes.func
    },

    render: function() {
        var _this = this;
//        console.log(this.props.sublist)
//        console.log(this.props.sublistfunc)
        return (React.createElement("div", null, 
            React.createElement("ul", null, 
            React.createElement("li", null, " Hello")
            ), 

        React.createElement("h1", null, "Date ", this.props.worker, " "), 
        React.createElement("h1", null, "Date ", this.props.dates[0].getFullYear(), " "), 
        React.createElement("li", null,  this.props.dates.map(function(e, i){
            console.log(_this.props.sublistfunc(e))


            return (React.createElement("div", null, React.createElement("p", null, String(e)), React.createElement(CalendarCell, {dateArray: _this.props.sublistfunc(e) || []})))
            }) )
        ));
    }
});
AppMain.value('Calendar', Calendar);


var CalendarCell = React.createClass({displayName: "CalendarCell",
    propTypes: {
        dateArray : React.PropTypes.array.isRequired,
//        day : React.PropTypes.string.isRequired
    },
    render: function() {

        return (React.createElement("div", null, this.props.dateArray.map(function(n){return React.createElement(WorkerLeaveCell, null) })));
    }
});
AppMain.value('CalendarCell', CalendarCell);

var WorkerLeaveCell = React.createClass({displayName: "WorkerLeaveCell",
    propTypes: {
//        date : React.PropTypes.string.isRequired,
//        day : React.PropTypes.string.isRequired
    },
    render: function() {
        return React.createElement("p", null, "I am a WORKER");
    }
});
AppMain.value('WorkerLeaveCell', WorkerLeaveCell);