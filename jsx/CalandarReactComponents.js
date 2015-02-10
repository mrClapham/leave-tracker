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
            <CalendarCell />
            <CalendarCell />
            <CalendarCell />
            <CalendarCell />
        <h1>Date {this.props.worker} </h1>
        <h1>Date {this.props.dates[0].getFullYear()} </h1>
        <li>{ this.props.dates.map(function(e, i){
            console.log(_this.props.sublistfunc(e))


            return (<p>{String(e)}</p>)
            }) }</li>
        </div>);
    }
});
AppMain.value('Calendar', Calendar);


var CalendarCell = React.createClass({
    propTypes: {
//        date : React.PropTypes.string.isRequired,
//        day : React.PropTypes.string.isRequired
    },
    render: function() {
        return <p>I am a cell</p>;
    }
});
AppMain.value('CalendarCell', CalendarCell);