/** @jsx React.DOM */
var Calendar = React.createClass({displayName: "Calendar",
    propTypes: {
        alldata : React.PropTypes.array,
        dates : React.PropTypes.array.isRequired,
        sublist : React.PropTypes.array,
        daysoff : React.PropTypes.array,
        sublistfunc : React.PropTypes.func,
        worker : React.PropTypes.string,
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
        return (React.createElement("div", null, 
        React.createElement("h1", null, "Date ", this.props.worker, " "), 
        React.createElement("h1", null, "Date ", this.props.dates[0].getFullYear(), " "), 
            React.createElement("ul", {className: "date-list"}, 
             this.props.dates.map(function(e, i){
                var _i = i;
                var _dateData = _this.dataByDate(_this.props.alldata, e);
                return (React.createElement("li", {className: "date-cells"}, React.createElement("p", null, String(e)), React.createElement(CalendarCell, {staticTester: "Just testing", _date: e, dateArray: _dateData, _alldata: _this.props.alldata})))
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
        staticTester : React.PropTypes.string,
        _date: React.PropTypes.object,
        _alldata : React.PropTypes.array
    },

    addHello:function(string){
        return string+" CalendarCell."
    },

    render: function() {
        //console.log("CalendarCell key : ", this.props.key)
        //console.log("CalendarCell dateArray : ", this.props.dateArray)
        //console.log("CalendarCell staticTester : ", this.props.staticTester)
        var _this = this
        return (React.createElement("ul", {classname: "individual-leave-cell"}, this.props.dateArray.map(function(n){return React.createElement(WorkerLeaveCell, {date: _this.props._date, data: n, alldata: _this.props._alldata}) })));
    }
});
AppMain.value('CalendarCell', CalendarCell);





var WorkerLeaveCell = React.createClass({displayName: "WorkerLeaveCell",
    propTypes: {
        key : React.PropTypes.number,
        data : React.PropTypes.object,
        date: React.PropTypes.object,
        alldata : React.PropTypes.array,
        removed : React.PropTypes.bool
    },
    getDefaultProps: function() {
        return {
            deleted: false
        };
    },
    removeArrayItem : function(){
       // console.log(" --  CLICKED ",this.props.data.key);
        var __key = this.props.data.key;
        var __data = this.props.alldata;
        _.remove(__data, function(n) { return n.key == __key; });
        this.render()
        console.log("The key ",__key);
    },
    render: function() {
        /*
         key: 42
         name: "Matthew Webb"
         unit: "PM"
         userid: "1"
         value: "P"
         */
        return (React.createElement("li", {classname: "leave-list-item {this.props.data.unit}"}, 
                    React.createElement("p", null, 
                    React.createElement("p", {onClick: this.removeArrayItem}, "remove"), 
                    React.createElement("p", null, this.props.data.unit, " : "), React.createElement("span", {className: "value"}, this.props.data.value), " ", this.props.data.name
                    )
                ));
    }
});
AppMain.value('WorkerLeaveCell', WorkerLeaveCell);



