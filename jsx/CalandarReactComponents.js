/** @jsx React.DOM */
var Calendar = React.createClass({
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
        return (<div>
            <ul>
            <li> Hello</li>
            </ul>

        <h1>Date {this.props.worker} </h1>
        <h1>Date {this.props.dates[0].getFullYear()} </h1>
        <li>{ this.props.dates.map(function(e, i){
            console.log(_this.props.sublistfunc(e))


            return (<div><p>{String(e)}</p><CalendarCell dateArray ={_this.props.sublistfunc(e) || []} /></div>)
            }) }</li>
        </div>);
    }
});
AppMain.value('Calendar', Calendar);


var CalendarCell = React.createClass({
    propTypes: {
        dateArray : React.PropTypes.array.isRequired,
//        day : React.PropTypes.string.isRequired
    },
    render: function() {

        return (<div>{this.props.dateArray.map(function(n){return <WorkerLeaveCell /> })}</div>);
    }
});
AppMain.value('CalendarCell', CalendarCell);

var WorkerLeaveCell = React.createClass({
    propTypes: {
//        date : React.PropTypes.string.isRequired,
//        day : React.PropTypes.string.isRequired
    },
    render: function() {
        return <p>I am a WORKER</p>;
    }
});
AppMain.value('WorkerLeaveCell', WorkerLeaveCell);