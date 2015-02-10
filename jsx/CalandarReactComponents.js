/** @jsx React.DOM */
var Calendar = React.createClass({
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
        return (<div>
        <h1>Date {this.props.worker} </h1>
        <h1>Date {this.props.dates[0].getFullYear()} </h1>
            <ul className="date-list">
            { this.props.dates.map(function(e, i){

                //console.log(_this.props.sublistfunc(e))
                //console.log("Calendar i ",i)
               // console.log("Calendar e ",e)
                    var _i = i;
                var _dateData = _this.dataByDate(_this.props.alldata, e);
                console.log("The _i value is ",_i);
                console.log("_dateData", _dateData);
                console.log("_dateData", _dateData);

                return (<li className="date-cells"><p>{String(e)}</p><CalendarCell staticTester="Just testing" key="_i" dateArray ={_dateData} /></li>)
                }) }
                </ul>
        </div>);
    }
});
AppMain.value('Calendar', Calendar);


var CalendarCell = React.createClass({
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
        return (<ul classname="individual-leave-cell">{this.addHello("helloo ")} {this.props.dateArray.map(function(n){return <WorkerLeaveCell key={n.key}  data={n} /> })}</ul>);
    }
});
AppMain.value('CalendarCell', CalendarCell);

var WorkerLeaveCell = React.createClass({
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
        return (<li classname="leave-list-item">
                    <p>I am {this.props.data.name}</p>
                </li>);
    }
});
AppMain.value('WorkerLeaveCell', WorkerLeaveCell);
