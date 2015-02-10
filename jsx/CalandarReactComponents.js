/** @jsx React.DOM */
var Calendar = React.createClass({
    propTypes: {
        alldata : React.PropTypes.array,
        dates : React.PropTypes.array.isRequired,
        daysoff : React.PropTypes.array,
        sublistfunc : React.PropTypes.func,
        worker : React.PropTypes.string
    },
    getInitialState:function(){
        return{
            colourArray:createTweenColours({r:232,g:160,b:12}, {r:13,g:255,b:235}, 25)
        }
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
            <ul className="date-list">
            { this.props.dates.map(function(e, i){
                var _i = i;
                var _dateData = _this.dataByDate(_this.props.alldata, e);
                var _dates = ["monday","tuesday", "wednesday", "thursday", "friday", "saturday","sunday"]
                var dateString = _dates[e.getDay()]+" "+ e.getDate()+":"+ (e.getMonth()+1)+":"+e.getFullYear();
                var _colourArray = _this.state.colourArray
                //console.log('FIRST ARRAY IS ', _colourArray)

                return (<li className="date-cells"><p>{dateString}</p><CalendarCell colourArray={_colourArray} _date={e} dateArray ={_dateData} _alldata={_this.props.alldata} /></li>)
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
        _date: React.PropTypes.object,
        _alldata : React.PropTypes.array,
        colourArray : React.PropTypes.array

    },

    render: function() {
        //console.log("CalendarCell key : ", this.props.key)
        //console.log("CalendarCell dateArray : ", this.props.dateArray)
        //console.log("CalendarCell staticTester : ", this.props.staticTester)
        var _this = this
        var _colourArray = _this.props.colourArray;
        //console.log('SECOND ARRAY IS ', _colourArray)
        return (<ul className="individual-leave-cell ">{this.props.dateArray.map(function(n){return <WorkerLeaveCell colourArray={_colourArray} date={_this.props._date}  data={n} alldata={_this.props._alldata}/> })}</ul>);
    }
});
AppMain.value('CalendarCell', CalendarCell);



var WorkerLeaveCell = React.createClass({
    propTypes: {
        key : React.PropTypes.number,
        data : React.PropTypes.object,
        date : React.PropTypes.object,
        alldata : React.PropTypes.array,
        colourArray : React.PropTypes.array
    },
    getInitialState: function() {
        return {
            deleted: false,
            showclass: "leave-cell show-true"
        };
    },
    removeArrayItem : function(e){
        e.preventDefault();
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
        var getValueSymbol = function(val){
            var __class;
            switch(val){
                case 'V' :
                __class = "fa fa-bed"
                break;
                case 'T' :
                __class = "fa fa-graduation-cap"
                break;
                case 'P' :
                __class = "fa fa-calendar"
                break;
                default :
                __class = "fa fa-calendar"
                break;
            }
            return __class
        }

          var getTimeSymbol = function(val){
            var __class;
            switch(val){
                case 'PM' :
                __class = "fa fa-moon-o"
                break;
                case 'AM' :
                __class = "fa fa-sun-o"
                break;
                default :
                __class = "fa fa-sun-o"
                break;
            }
            return __class
        }




        var icon = getValueSymbol(this.props.data.value)
        var time = getTimeSymbol(this.props.data.unit)

        var divStyle = {
            backgroundColor: this.props.colourArray[this.props.data.userid],
            WebkitTransition: 'all', // note the capital 'W' here
            msTransition: 'all' // 'ms' is the only lowercase vendor prefix
            };
        return (<li className="leave-list-item {this.props.data.unit}">
                    <div className={this.state.showclass} style={divStyle}>
                    <p> <a className="fa fa-trash-o" onClick={this.removeArrayItem} > </a>  {this.props.data.name} | <span className={icon} > | </span> <span className={time} ></span></p>
                    </div>
                </li>);
    }
});
AppMain.value('WorkerLeaveCell', WorkerLeaveCell);


var createTweenColours = function(start, end, steps){
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





