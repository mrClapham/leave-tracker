/** @jsx React.DOM */
var Calendar = React.createClass({
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
        return (<div>
        <h1>Date {this.props.worker} </h1>
        <h1>Date {this.props.dates[0].getFullYear()} </h1>
            <ul className="date-list">
            { this.props.dates.map(function(e, i){

                console.log(_this.props.sublistfunc(e))
                console.log("Calendar i ",i)
                console.log("Calendar e ",e)

                return (<li className="date-cells"><p>{String(e)}</p><CalendarCell key={i} dateArray ={_this.props.sublistfunc(e) || []} /></li>)
                }) }
                </ul>
        </div>);
    }
});
AppMain.value('Calendar', Calendar);


var CalendarCell = React.createClass({
    propTypes: {
        dateArray : React.PropTypes.array.isRequired,
        key : React.PropTypes.number.isRequired
    },

    render: function() {
        return (<ul classname="individual-leave-cell">{this.props.dateArray.map(function(n){return <WorkerLeaveCell key={n.key}  data={n} /> })}</ul>);
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
