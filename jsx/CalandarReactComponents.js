/** @jsx React.DOM */
var Calendar = React.createClass({
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
        return (<div>
        <h1>Date {this.props.worker} </h1>
        <h1>Date {this.props.dates[0].getFullYear()} </h1>
            <ul className="date-list">
            { this.props.dates.map(function(e, i){
                var _i = i;
                var _dateData = _this.dataByDate(_this.props.alldata, e);
                return (<li className="date-cells"><p>{String(e)}</p><CalendarCell staticTester="Just testing" _date={e} dateArray ={_dateData} _alldata={_this.props.alldata} /></li>)
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
        return (<ul className="individual-leave-cell ">{this.props.dateArray.map(function(n){return <WorkerLeaveCell date={_this.props._date}  data={n} alldata={_this.props._alldata}/> })}</ul>);
    }
});
AppMain.value('CalendarCell', CalendarCell);





var WorkerLeaveCell = React.createClass({
    propTypes: {
        key : React.PropTypes.number,
        data : React.PropTypes.object,
        date: React.PropTypes.object,
        alldata : React.PropTypes.array,
        removed : React.PropTypes.bool
    },
    getDefaultProps: function() {
        return {
            deleted: false,
            showclass: "leave-cell show-true"
        };
    },
    removeArrayItem : function(){
       // console.log(" --  CLICKED ",this.props.data.key);
        var __key = this.props.data.key;
        var __data = this.props.alldata;
        _.remove(__data, function(n) { return n.key == __key; });
        console.log("The key ",__key);
        this.setState({showclass: "leave-cell show-false"})
    },
    render: function() {
        /*
         key: 42
         name: "Matthew Webb"
         unit: "PM"
         userid: "1"
         value: "P"
         */
        return (<li className="leave-list-item {this.props.data.unit}">
                    <div className={this.props.showclass}>
                    <p> <a onClick={this.removeArrayItem} >remove</a>{this.props.data.unit} : <span className="value">{this.props.data.value}</span> {this.props.data.name}</p>
                    </div>
                </li>);
    }
});
AppMain.value('WorkerLeaveCell', WorkerLeaveCell);



