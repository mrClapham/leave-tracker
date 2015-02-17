/**
 * Created by grahamcapham on 16/02/2015.
 */

LeaveChart = (function(targID){

    var _scope = function(targID){
        this._targID        = targID;
        this._target        = null;
        this.width          = 1200;
        this.height         = 1000;
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

        this._view          = {svg:null, _linesHolder:null};
        this.padding        = {left:120, right:20, top:50, bottom:160}

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

        console.log("SVG INITED ", this._target)

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
            .attr('transform', "translate(" + 10 + "," + this.padding.top  + ")");

        var _names =  _.filter(_.uniq(_.map(this._data, "name")), function(n){
            return _.isString(n)
        })

        var names =  _.uniq(this._data, "name")

        console.log("_______________names ", names)

//        _.filter(_.uniq(_.map(this._data, "name")), function(n){
//            return _.isString(n)
//        })
        var _this = this

        this._nameList = this._view._nameHolder
            .selectAll(".names")
            .data(names)
            .enter().append('g')
            .attr("class", "names")
            .attr("transform", function(d, i) {
                console.log(d.userid )
                return "translate("+0+","+ (d.userid-1) * _this._Yoffset +")";
            })

        this._nameList
            .attr('fill', '#0000ff')
            .append("svg:rect")
            .attr('width',this.padding.left)
            .attr('height',_this._Yoffset )

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
            .attr("dy", "1.3em")

      //  this._nameList.exit().remove();


        /*

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


         */




    }

    var _initTimeAxis = function(){

        var _this = this;
        this._view._xAxis = d3.svg.axis()
            .scale(this._xScale)
            .orient("bottom")
            .ticks(d3.time.week,1)
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

//        this._view._xTickHolder
//            .append("g")
//            .attr('x', _this._xScale)
//            .attr('width', 10)
//            .attr('height', 200)
//            .attr('fill', '#ff0000')
//            .attr('class', 'textHolder')
//            .attr('transform', function(d,i){return 'translate('+_this._xScale(d.date)+','+( 10 )+')'})


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
//        console.log("_updateTimeAxis ")
//        console.log("_updateTimeAxis _view._xAxisHolder ",this._view._xAxisHolder)
        //console.log("_updateTimeAxis _this._view._xAxis ", this._view._xAxis)
        var _this = this
        this._view._xAxisHolder
            .call(_this._view._xAxis);
    }

    var _intBrush = function(){
        var _this = this;

        this._brush = new d3.svg.brush()
            .x(this._brushXScale)
            .on("brush", function(){ _brushFunction.call(_this);  })

        this._view._brushHolder = this._view._svg
            .append("g")
            .attr('transform', "translate(" + this.padding.left + "," + (this.height -60)  + ")")
            .attr("class", "x brush")
            .call(this._brush)
            .selectAll("rect")
            .attr("y", -6)
            .attr("height", 30);
        var _this = this
        this._view._brusAxishHolder = this._view._svg
            .append("g")
            .attr('transform', "translate(" + this.padding.left + "," + (this.height -30)  + ")")
            .call(this._view._xAxisBrush)

    }

    var _brushFunction = function(e){
        this._xScale.domain(this._brush.empty() ? this._xScale.domain() : this._brush.extent());

        //focus.select(".area").attr("d", area);
        //focus.select(".x.axis").call(this._view._xAxis);
        var _xAx = this._view._xAxisHolder
                    .call(this._view._xAxis);
        //_updateTimeAxis.call(this);
        //_drawLine.call(this);
        _updateDots.call(this);

//        x.domain(brush.empty() ? x2.domain() : brush.extent());
//        focus.select(".area").attr("d", area);
//        focus.select(".x.axis").call(xAxis);
    }

    var _onDataSet = function(){
        //console.log("this._data.DATES" , this._data);

        this.min_max_date = d3.extent(this._data, function(d) { return d.jsDate; })
        console.log("MIN AND MAX ",this.min_max_date)

//        this._vDomainMin    = this._data.MINVOL;
//        this._vDomainMax    = this._data.MAXVOL;
//        this._vMin          = this.padding.left;
//        this._vMax          = this.width-this.padding.right;
//
//        this._xDomainMin    = this._data.MINVOL;
//        this._xDomainMax    = this._data.MAXVOL;
//        this._xMin          = this.padding.left;
//        this._xMax          = this.width-this.padding.right;
//
       this._xScale = d3.time.scale()
           .domain( this.min_max_date  )
           .range([0, this.width - this.padding.left - this.padding.right]);

        this._brushXScale   = d3.time.scale()
            .domain( this.min_max_date  )
            .range([0 , this.width - this.padding.left - this.padding.right]);


        this._brushXScaleStatic   = d3.time.scale()
            .domain( this.min_max_date  )
            .range([0, this.width - this.padding.left - this.padding.right]);
//
//        this._vScale        = d3.scale.linear()
//            .domain([this._vDomainMin, this._vDomainMax])
//            .range([this.height - this.padding.top - this.padding.bottom, 0]);

        _draw.call(this);
    };

    var _draw = function(){
       // _drawLine.call(this);
        _initTimeAxis.call(this);
        // _drawSentiment.call(this);
        _intBrush.call(this);
        _drawDots.call(this);
        _initNameAxis.call(this);

    };

    var _drawDots = function(){
        var _this = this;
        this._dots = this._view._dotHolder.selectAll('.dot')
                    .data(this._data)
        this._dots
            .enter().append('g')
            .attr("class", "dot")
            .attr("transform", function(d, i) {
                return "translate("+_this._xScale(d.jsDate)+","+ ( (d.userid * _this._Yoffset) - _this._Yoffset)+")";
            })

        this._dots
            .append('rect')
            .attr("x", function(d, i) {
                return  0 ;
            })
            .attr("width", 12)
            .attr("y", function(d,i){
                //return d.userid * 20
                return   d.unit == 'AM' ? _this._Yoffset/2 : 0;
            })
            .attr("height", function(d,i) { return _this._Yoffset/2 })
            .attr('fill', function(d,i){return  d.unit == 'AM' ? 'rgba(255,0,255,255)' : 'rgba(0,255,255,255)'})
            .on('click', function(d,i){console.log(d)})

        this._dots.exit().remove()
    }

    var _updateDots = function(){
        var _this = this
        this._dots
            .transition()
            .attr("transform", function(d, i) {
                return "translate("+_this._xScale(d.jsDate)+","+ ( (d.userid * _this._Yoffset) - _this._Yoffset)+")";
            })
    }

    var _drawLine = function(){
        // The Volume line

        console.log("drawline called ")
        //console.log(this._xScale.domain)

        var _this = this;
        this._volumeArea = d3.svg.area()
            .interpolate("cardinal")
            .x(function(d, i) {
                console.log(" DATE ", _this._xScale(d.date) );
                return  _this._xScale(d.date) ;
            })
            .y0(function(d) {
                //console.log(d)
                return _this._vScale(d.volume);
            })
            .y1(function(d) {
                return _this.height-_this.padding.bottom;
            });


        var arr =   this._view._linesHolder.selectAll('path.areas')
            .data([this._data.VOLUME])
            .enter().append("path")
            .style("fill", '#cccccc')
            .attr("class", "areas")
            .attr("d", this._volumeArea);

        // _drawSentiment.call(this);
    }

    /// COLOUR TEST
    var _drawSentiment = function(){
        var _this = this;
        var _colourBars = this._view._linesHolder.selectAll('coloBar')
            .data(this.data.TICKS)
            .enter().append('rect')
            .attr("x", function(d, i) {
                return  _this._xScale(d.date) ;
            })
            .attr("width", 4)
            .attr("y", 10)

            .attr("height", function(d,i) { return 60 })
            .attr('fill', function(d,i){return ColourRamp.getColour( d.volume)})
    }

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