/**
 * Created by grahamcapham on 16/02/2015.
 */

LeaveChart = (function(targID){

    var _scope = function(targID){
        this._targID        = targID;
        this._target        = null;
        this.width          = 1400;
        this.height         = 900;
        this.backgroundColor     = "rgba(20,30,50, 10)";
        this._canvas        = null;
        this._data          = null;
        this._lines         = null;
        this._volumeArea    = null;
        this._dots          = null;
        this._brush         = null;
        this._vScale        = null;
        this._vMin          = null;
        this._vMax          = null;
        this._vDomainMin    = null;
        this._vDomainMax    = null;
        this._xScale        = null;
        this._brushXScale   = null;
        this._xMin          = null;
        this._xMax          = null;
        this._xDomainMin    = null;
        this._xDomainMax    = null;
        this._Yoffset        = 30;
        this._months         = 12

        this._view          = {svg:null, _linesHolder:null};
        this.padding        = {left:150, right:20, top:50, bottom:160}

        _init.call(this);
    }
    //----
    _scope.prototype = {
        setData:function(value){
            this._data = value;
            _onDataSet.call(this);
        }
    };
    //-- callbacks
    var _init = function(){
        this._target = document.getElementById( this._targID );

        _initSVG.call(this);
    };

    var _initScale = function(){
        this._vScale = d3.scale.linear()
            .domain([this._vMin, this._vMax])
            .range([this._vDomainMin, this._vDomainMax]);
        return Math.ceil( vScale(value) )
    };

    var _initSVG = function(){
        this._view._svg = d3.select(this._target)
            .style('position', 'relative')
            .style('width', this.width+ "px")
            .style('height', this.height+ "px")
            .style('background-color',  this.backgroundColor)
            .append('svg:svg')
            .attr('width',this.width)
            .attr('height',this.height )
            .attr('class', "myClass")
//            .attr('transform', "translate(" + this.padding.left + "," + this.padding.top  + ")");

        this._view._linesHolder = this._view._svg
            .append("g")
            .attr('class', 'lineHolder')
            .attr('transform', "translate(" + this.padding.left + "," + this.padding.top  + ")");

        this._view._dotHolder = this._view._svg
            .append("g")
            .attr('class', 'dotHolder')
            .attr('transform', "translate(" + this.padding.left + "," + this.padding.top  + ")");
    };

    var _initNameAxis = function(){
        this._view._nameHolder = this._view._svg
            .append("g")
            .attr('class', 'nameHolder')
            .attr('transform', "translate(" + 0 + "," + this.padding.top  + ")");

        var _names =  _.filter(_.uniq(_.map(this._data, "name")), function(n){
            return _.isString(n)
        })

       this.names =  _.uniq(this._data, "name")
//        _.filter(_.uniq(_.map(this._data, "name")), function(n){
//            return _.isString(n)
//        })
        var _this = this

        this._nameList = this._view._nameHolder
            .selectAll(".names")
            .data(this.names)
            .enter().append('g')
            .attr("class", "names")
            .attr("transform", function(d, i) {
                return "translate("+0+","+ (d.userid-1) * _this._Yoffset +")";
            })

        this._nameList
            .attr('fill', this.backgroundColor)
            .append("svg:rect")
            .attr('width',this.padding.left - 12)
            .attr('height',_this._Yoffset )
            .attr("transform", function(d, i) {
                return "translate("+0+","+ -10 +")";
            })
        this._nameList
            .append("svg:line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", 1500)
            .attr("y2", 0)
            .style("stroke-dasharray", ("1, 1"))
            .attr("stroke-width", 1)
            .attr("stroke", "rgba(255, 255, 255, .2)");

        this._nameList
            .append("text")
            .attr('fill', '#ffffff')
            .text(function(d,i){return d.name })
            .attr("dy", "0.4em")
            .attr("dx", "1.3em")

      //  this._nameList.exit().remove();


    }

    var _initTimeAxis = function(){

        var _this = this;

        this._view._xAxis = d3.svg.axis()
            .scale(this._xScale)
            .orient("bottom")
            .ticks(d3.time.week,12)
            .tickSize(-_this.height, 0, 0)
            .tickFormat(d3.time.format("%b %d %Y"));

        this._view._xAxisBrush = d3.svg.axis()
            .scale(this._xScale)
            .orient("bottom")
            .ticks(d3.time.month,1)
            .tickFormat(d3.time.format("%b %Y"));

        var _this = this
        this._view._xAxisHolder = this._view._svg.append("g")
            .attr("transform","translate("+this.padding.left+"," + ( _this.height - _this.padding.bottom ) + ")")
            .attr("class", "x axis")
            .attr("class","xTimeAxis");

        this._view._xTickHolder = this._view._svg.append("g")
            .attr("transform","translate("+this.padding.left+"," + ( _this.height - _this.padding.bottom ) + ")")
            .attr("class","xTimeAxisTicks")


        this._view._xAxisTicks =  this._view._xTickHolder.selectAll('.tickY')
            .data(_this._xScale.ticks(d3.time.day))

        this._view._xAxisTicks
            .enter()
            .append("g")
            .attr('class', 'tickY')
            .append("svg:line")
            .attr("x1", _this._xScale)
            .attr("x2", _this._xScale)
//            .attr("y1", -300)
//            .attr("y2", 200 )
            .attr("class", "yTickLine" )

        this._view._xAxisTicks
            .exit()
            .remove();

        _updateTimeAxis.call(this);
    }

    var _updateTimeAxis = function(){
        var _this = this
        this._view._xAxisHolder
            .call(_this._view._xAxis);
    }

    var _intBrush = function(){
        var _this = this;

        this._brush = new d3.svg.brush()
            .x(this._brushXScale)
            .on("brush", function(){ _brushFunction.call(_this);  })
            .extent([this.min_max_date[0], this.min_max_date[1]]);

        this._view._brushHolder = this._view._svg
            .append("g")
            .attr('transform', "translate(" + this.padding.left + "," + 0 + ")")
            .attr("class", "x brush")
            .call(this._brush)
        var brushMargin = 20
        this._view._brushHolder
            .selectAll("rect")
            .attr("y", -6)
            .attr("height", this.padding.top - brushMargin);

        var _this = this;

        this._view._brusAxishHolder = this._view._svg
            .append("g")
            .attr("class", "brushDateAxis")
            .attr('transform', "translate(" + this.padding.left + "," + 0  + ")")
            .call(this._view._xAxisBrush)

        var handles = this._view._brushHolder
            .selectAll(".resize")
            .append("svg:rect")
            .attr("width", 10)
            .attr("class", "brush-handle")
            .attr("height", this.padding.top - brushMargin)
            .attr("y", -6)
            .attr("fill", '#ff0000');

        console.log("_brusAxishHolder _",this._view._brusAxishHolder)
        console.log("HANDLES _",handles)
    }

    var monthDiff = function(d1, d2) {
        var months;
        months = (d2.getFullYear() - d1.getFullYear()) * 12;
        months -= d1.getMonth() + 1;
        months += d2.getMonth();
        return months <= 0 ? 0 : months;
    }

    var _brushFunction = function(e){
        this._xScale.domain(this._brush.empty() ? this._xScale.domain() : this._brush.extent());

        this._months  = monthDiff(this._brush.extent()[0], this._brush.extent()[1])

        console.log(this._months)

        if(this._months<=1){
            this._view._xAxis
                .ticks(d3.time.day,1)
                .tickFormat(d3.time.format("%b %d"));

        }
        if(this._months>1 && this._months<3){
            this._view._xAxis
                .ticks(d3.time.week,1)
                .tickFormat(d3.time.format("%b %Y"));

        }
        if(this._months>3){
            this._view._xAxis
                .ticks(d3.time.month,1)
                .tickFormat(d3.time.format("%b %d %Y"));
        }

        var _xAx = this._view._xAxisHolder
                    .call(this._view._xAxis);

        _updateDots.call(this);
    }
//----------------
    var _onDataSet = function(){
        this.min_max_date = d3.extent(this._data, function(d) { return d.jsDate; });
        console.log("MIN AND MAX ",this.min_max_date);

       this._xScale = d3.time.scale()
           .domain( this.min_max_date  )
           .range([0, this.width - this.padding.left - this.padding.right]);

        this._brushXScale   = d3.time.scale()
            .domain( this.min_max_date  )
            .range([0 , this.width - this.padding.left - this.padding.right]);


        this._brushXScaleStatic   = d3.time.scale()
            .domain( this.min_max_date  )
            .range([0, this.width - this.padding.left - this.padding.right]);



        _draw.call(this);
    };

    var _makeEmptyDates = function(){
        this._allDates = _createCalandarArray.call(this);
        //console.log("this._allDates ----- ",this._allDates)
        this.datesByWorker = _createPersonArray.call(this, this._allDates)
        console.log("this.datesByWorker ", this.datesByWorker)
    }

    //----

    var _createCalandarArray = function(){
        var a = [];
        var startDate = this.min_max_date[0];
        a.push(new Date(startDate))

        while(startDate < this.min_max_date[1]){
            startDate.setDate(startDate.getDate()+1);
            //ignore weekends
            if(startDate.getDay() != 0 &&  startDate.getDay() != 6){
                a.push(new Date(startDate))
            }
        }
        return(a);
    }

    var _createPersonArray = function(arr){
    /*
     jsDate: Mon Oct 06 2014 00:00:00 GMT+0100 (BST)key: 0name: "Matthew Webb"unit: "AM"userid: "1"value: "V"
     */
        var _createObject = function(name, userid, jsDate){
            return {userid:userid, jsDate: jsDate, name:name, key:0, unit:null, value:null}
        }
        //console.log("AAA    ",arr)
        var a = [];
        var _this = this
        console.log("N A M E S :",this.names)
        arr.forEach(function(i){
        //console.log(a)
            var _i = i
        _this.names.forEach(function(n){
           // console.log(i)
            a.push(_createObject(n.name, n.userid, i))
            })
        })

    return a;
    }

//--------------
    var _draw = function(){
        _initTimeAxis.call(this);
        _drawDots.call(this);
        _initNameAxis.call(this);
        _intBrush.call(this);
        _makeEmptyDates.call(this);

    };


    var _makeArc = function(){
        var arc = d3.svg.arc()
            .outerRadius(9)
            //.innerRadius(6)
            .startAngle(0)
            .endAngle(function(d, i) { return Math.PI; });
        return arc
    }

    var _drawDots = function(){
        var _this = this;
        this._dots = this._view._dotHolder.selectAll('.dot').remove()

        this._dots = this._view._dotHolder.selectAll('.dot')
                    .data(this._data)
        var radius = _this._Yoffset/4


        this._dots
            .enter().append('g')
            .attr("class", "dot")
            .attr("transform", function(d, i) {
                return "translate("+_this._xScale(d.jsDate)+","+ ( (d.userid * _this._Yoffset) - _this._Yoffset)+")";
            })


      //  this._dots
            .append('svg:path')
            .attr("d", _makeArc() )
            .attr("transform", function(d) {
                return d.unit == 'AM' ? "rotate(-90)" : "rotate(90)"
            })
            .style('opacity', function(d,i){
                return d.unit == 'AM' ? "0.5" : "1"
            })
            .attr('fill', function(d,i){
                var _fill;
                switch(d.value){
                    case "V" :
                        _fill = 'rgba(0,255,0,.5)'
                        break;
                    case "T" :
                        _fill = 'rgba(255,255,0,.5)'
                        break;
                    case "P" :
                        _fill = 'rgba(0, 0,255,.5)'
                        break;
                    default :
                        _fill = 'rgba(60, 60,60,.5)'
                        break;
                }

                return  _fill //d.unit == 'AM' ? 'rgba(0,255,0,.5)' : 'rgba(255,0,0,1)'

            })
            .on('mouseover', function(d,i){
                console.log(d.key);
            })
            .on('click', function(d,i){
                console.log(d)
                var _d = d
                _.remove(_this._data, function(n) {
                    return n.key == _d.key;
                });
//
                console.log(_this._data.length)
                console.log(_this._data)
                _drawDots.call(_this);
            })

        // first remove the text
/*
        this._dots.selectAll(".key").remove()

        this._dots
            .append("g")
            .attr("class", "key")
            .attr('fill', '#ffffff')
            .append("text")
            .attr("dy", function(d,i){return d.unit == "AM" ? "0em" : "1.2em"})
            .text(function(d,i){return d.key })

*/
        this._dots.exit().remove();

        _updateDots.call(this)
    }

    var _updateDots = function(){
        var _this = this;

        this._dots = this._view._dotHolder.selectAll('.dot')
            .data(this._data)

        this._dots.exit().remove()

        var _this = this
        this._dots
            .transition()
            .duration(0)
            .attr("transform", function(d, i) {
                return "translate("+_this._xScale(d.jsDate)+","+ ( (d.userid * _this._Yoffset) - _this._Yoffset)+")";
            })
    }


    /// COLOUR TEST


    return _scope;
})();

LeaveChart.stringToDate = function(string){
    var _arr = string.split(":");
    _arr[2] = "20"+ _arr[2]
    var _date = new Date();
    _date.setDate(_arr[0])
    _date.setMonth(_arr[1])
    _date.setFullYear(_arr[2])

    return _date
}
