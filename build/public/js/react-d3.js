(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.rd3 = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
exports.BooleanChart = require('./booleanchart').BooleanChart;



},{"./booleanchart":4}],2:[function(require,module,exports){
'use strict';

var React = (window.React);
var d3 = (window.d3);
var common = require('../common');
var Chart = common.Chart;
var XAxis = common.XAxis;
var YAxis = common.YAxis;
var utils = require('../utils');
var StackedChart = require('./StackedChart');
var mixins = require('../mixins');
var CartesianChartPropsMixin = mixins.CartesianChartPropsMixin;


module.exports = React.createClass({

  displayName: 'BooleanChart',

  mixins: [ CartesianChartPropsMixin ],

  propTypes: {
    margins: React.PropTypes.object,
    stackedChartMargins: React.PropTypes.object,
    colors: React.PropTypes.func,
    displayDataPoints: React.PropTypes.bool,
    booleanLabels: React.PropTypes.object,
    stackedChartLabel: React.PropTypes.bool
  },

  getDefaultProps:function() {
    return {
      stackedChartHeight: 120,
      margins: {top: 10, right: 20, bottom: 40, left: 45},
      stackedChartMargins: {top: 20, right: 20, bottom: 20, left: 45},
      className: 'rd3-booleanchart',
      stackedChartLabel: false,
      booleanLabels: {on: 'on', off: 'off'}
    };
  },

  render:function() {

    var props = this.props;

    if (!Array.isArray(props.data)) {
      props.data = [props.data];
    }

    var numberItems = props.data.length;

    var chartHeight = props.height / numberItems;

    // Calculate inner stacked chart dimensions
    var innerWidth, innerHeight;
    innerWidth = props.width - props.margins.left - props.margins.right;
    innerHeight = props.height - props.margins.top - props.margins.bottom;

    var stackedChartInnerHeight;
    stackedChartInnerHeight = props.stackedChartHeight - props.stackedChartMargins.top - props.stackedChartMargins.bottom;

    if (props.legend) {
      innerWidth = innerWidth - props.legendOffset;
    }

    var flattenedData = utils.flattenData(props.data, props.xAccessor, props.yAccessor);

    var allValues = flattenedData.allValues,
        xValues = flattenedData.xValues,
        yValues = flattenedData.yValues;

    var scales = utils.calculateScales(innerWidth, innerHeight, xValues, yValues);

    var trans = ("translate(" +  props.margins.left + "," +  props.stackedChartMargins.top + ")");

    var yScale = d3.scale.ordinal()
      .domain([true, false])
      .rangeBands([0, props.stackedChartInnerHeight/2]);

    var charts = props.data.map( function(series, idx)  {
          return (
            React.createElement("svg", {
              key: idx, 
              y: idx * (props.stackedChartHeight), 
              width: props.width, 
              height:  props.stackedChartInnerHeight
            }, 
              React.createElement("g", {transform: trans, className: props.className}, 
               
                // If it's the last series, we display the x axis
                // otherwise, it's a dotted line
                idx === props.data.length - 1 ? React.createElement(XAxis, {
                  xAxisClassName: "rd3-linechart-xaxis", 
                  tickFormatting: props.xAxisFormatter, 
                  xAxisLabel: props.xAxisLabel, 
                  xAxisLabelOffset: props.xAxisLabelOffset, 
                  xAxisTickCount: props.xAxisTickCount, 
                  xOrient: props.xOrient, 
                  xScale: scales.xScale, 
                  width: innerWidth, 
                  height: stackedChartInnerHeight, 
                  stroke: props.axesColor, 
                  strokeWidth: props.strokeWidth})
                : React.createElement("line", {
                    strokeWidth: "1", 
                    stroke: "black", 
                    strokeDasharray: "5, 4", 
                    x1: "0", y1: stackedChartInnerHeight, x2: innerWidth, y2: stackedChartInnerHeight}), 
              
                React.createElement(StackedChart, {
                  xScale: scales.xScale, 
                  yScale: yScale, 
                  seriesName: series.name, 
                  data: series.values, 
                  fill: props.colors(idx), 
                  key: series.name, 
                  xAccessor: props.xAccessor, 
                  yAccessor: props.yAccessor, 
                  booleanLabels: series.booleanLabels ? series.yAxisLabels : props.booleanLabels, 
                  stackedChartIndex: idx, 
                  stackedChartTop: idx * (stackedChartInnerHeight), 
                  stackedChartHeight: stackedChartInnerHeight, 
                  stackedChartLabel: props.stackedChartLabel}
                )
              )
            )
        )
    });
    return React.createElement(Chart, {
            viewBox: props.viewBox, 
            legend: props.legend, 
            data: props.data, 
            margins: props.margins, 
            colors: props.colors, 
            width: props.width, 
            height: props.height, 
            title: props.title
          }, 
          charts, 
          React.createElement("text", {
            strokeWidth: "0.01", 
            y: 10, x: -props.height/2, 
            textAnchor: "middle", 
            transform: "rotate(270)"}, 
            props.yAxisLabel
          )
          );

  }

});



},{"../common":16,"../mixins":18,"../utils":19,"./StackedChart":3}],3:[function(require,module,exports){
'use strict';

var React = (window.React);
var d3 = (window.d3);

module.exports = React.createClass({

  displayName: 'StackedChart',

  propTypes: {
    data: React.PropTypes.array,
    interpolationType: React.PropTypes.string,
    fill: React.PropTypes.string,
    xAccessor: React.PropTypes.func,
    yAccessor: React.PropTypes.func,
    displayDataPoints: React.PropTypes.bool,
    booleanLabels: React.PropTypes.object,
    stackedChartLabel: React.PropTypes.bool
  },

  getDefaultProps:function() {
    return {
      data: [],
      interpolationType: 'linear',
      fill: '#fff',
      xAccessor: function(d)  {return d.x;},
      yAccessor: function(d)  {return d.y;},
      displayDataPoints: true,
      squareWaveOffsetDivisor: 4,
    };
  },

  _isDate:function(d, accessor) {
    return Object.prototype.toString.call(accessor(d)) === '[object Date]';
  },

  renderVertical:function(isNotSameValue, linePoints) {
    if (isNotSameValue) {
      return React.createElement("line", {
        stroke: this.props.fill, 
        strokeWidth: "2", 
        x1: linePoints.x1, 
        x2: linePoints.x2, 
        y1: linePoints.y1, 
        y2: linePoints.y2}
        );
    }
    return React.createElement("g", null);
  },

  render:function() {

    var props = this.props;

    var xAccessor = props.xAccessor,
        yAccessor = props.yAccessor;

    var yScale = d3.scale.ordinal()
      .domain([true, false])
      .rangeBands([0, props.stackedChartHeight/2]);

    // Create array of paths, which we'll map over
    // to generate SVG lines
    var interpolatePath = d3.svg.line()
        .y(function(d) {
          return props.yScale(props.yAccessor(d));
        })
        .interpolate(props.interpolationType);

    // Check whether or not an arbitrary data element
    // is a date object (at index 0 here)
    // If it's a date, then we set the x scale a bit differently
    if (this._isDate(props.data[0], xAccessor)) {
        interpolatePath.x(function(d) {
          return props.xScale(props.xAccessor(d).getTime());
        });
    } else {
        interpolatePath.x(function(d) {
          return props.xScale(props.xAccessor(d));
        });
    }

    var lines = props.data.map(function(point, i) {
      var x1, x2, y1, y2, cy1, cy2, nextPoint, prevPoint;

      if (i === props.data.length - 1) {
        nextPoint = props.data[i];
        prevPoint = props.data[i - 1]
      } else if (i === 0) {
        nextPoint = props.data[i + 1];
        prevPoint = point;
      } else {
        nextPoint = props.data[i + 1];
        prevPoint = props.data[i - 1]
      }

      if (this._isDate(point, xAccessor)) {
        x1 = props.xScale(xAccessor(point).getTime());
        x2 = props.xScale(xAccessor(nextPoint).getTime());
      } else {
        x1 = props.xScale(xAccessor(point));
        x2 = props.xScale(xAccessor(nextPoint));
      }

      var squareWaveOffset = props.stackedChartHeight/props.squareWaveOffsetDivisor;

      if (yAccessor(point)) {
        y1 = squareWaveOffset;
        y2 = squareWaveOffset;
      } else {
        y1 = props.stackedChartHeight - squareWaveOffset;
        y2 = props.stackedChartHeight - squareWaveOffset;
      }

      var prevy2, prevy1;
      if (yAccessor(prevPoint)) {
        prevy1 = squareWaveOffset;
        prevy2 = squareWaveOffset;
      } else {
        prevy1 = props.stackedChartHeight - squareWaveOffset;
        prevy2 = props.stackedChartHeight - squareWaveOffset;
      }
 
      var isNotSameValue = yAccessor(point) !== yAccessor(nextPoint);

      var linePoints = {
        x1: x2,
        x2: x2,
        // y1 and y1 are always equal to the difference between 
        // the height of the stacked chart less the squareWaveOffset
        // and the squareWaveOffset itself
        y1: props.stackedChartHeight - squareWaveOffset,
        y2: squareWaveOffset
      };

      return (
        React.createElement("g", {key: i}, 
        React.createElement("line", {
          stroke: props.fill, 
          strokeWidth: "2", 
          key: i, 
          x1: x1, 
          y1: y1, 
          x2: x2, 
          y2: y2}
        ), 
        isNotSameValue ? React.createElement("line", {
          stroke: props.fill, 
          strokeWidth: "2", 
          x1: linePoints.x1, 
          x2: linePoints.x2, 
          y1: linePoints.y1, 
          y2: linePoints.y2}
          ) : React.createElement("g", null)
        
        )
      );
    }, this);

    return (
      React.createElement("g", null, 
         props.stackedChartLabel ? 
          React.createElement("text", {
          fontSize: "120%"
          }, props.seriesName)
        : React.createElement("text", null), 
        
        lines, 
        React.createElement("text", {
          strokeWidth: "0.01", 
          textAnchor: "middle", 
          dy: "0.25em", 
          x: -25, 
          y: props.stackedChartHeight - (props.stackedChartHeight/props.squareWaveOffsetDivisor)
        }, props.booleanLabels.off), 
        React.createElement("text", {
          dy: "0.25em", 
          strokeWidth: "0.01", 
          textAnchor: "middle", 
          x: -25, 
          y: props.stackedChartHeight/props.squareWaveOffsetDivisor
        }, props.booleanLabels.on)
      )
    );
  }

});



},{}],4:[function(require,module,exports){
exports.BooleanChart = require('./BooleanChart');



},{"./BooleanChart":2}],5:[function(require,module,exports){
'use strict';

var React = (window.React);
var d3 = (window.d3);

module.exports = React.createClass({displayName: "exports",

  propTypes: {
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    margins: React.PropTypes.object,
    text: React.PropTypes.string,
    colors: React.PropTypes.func
  },

  getDefaultProps: function() {
    return {
      text: "#000",
      colors: d3.scale.category20c()
    };
  },

  render: function() {

    var props = this.props;

    var textStyle = {
      'color': 'black',
      'fontSize': '50%',
      'verticalAlign': 'top'
    };

    var legendItems = [];

    props.data.forEach( function(series, idx)  {

      var itemStyle = {
        'color': props.colors(idx),
        'lineHeight': '60%',
        'fontSize': '200%'
      };

      legendItems.push(
            React.createElement("li", {style: itemStyle, key: idx}, 
              React.createElement("span", {style: textStyle}, series.name)
            )
          );

    });

    // In preparation for legend positioning
    var legendFloat = 'right';

    var topMargin = props.margins.top;

    var legendBlockStyle = {
      'wordWrap': 'break-word',
      'width': props.sideOffset,
      'paddingLeft': '0',
      'marginBottom': '0',
      'marginTop': topMargin,
      'float': legendFloat
    };

    return React.createElement("ul", {style: legendBlockStyle}, legendItems);
  }

});




},{}],6:[function(require,module,exports){
'use strict';

var React = (window.React);
var d3 = (window.d3);

module.exports = React.createClass({displayName: "exports",

  propTypes: {
    scale: React.PropTypes.func.isRequired,
    innerTickSize: React.PropTypes.number,
    outerTickSize: React.PropTypes.number,
    tickPadding: React.PropTypes.number,
    tickArguments: React.PropTypes.array,
    fill: React.PropTypes.string,
    stroke: React.PropTypes.string
  },

  getDefaultProps:function() {
    return {
      innerTickSize: 6,
      outerTickSize: 6,
      tickPadding: 3,
      tickArguments: [10],
      tickValues: null,
      tickFormat: null 
    };
  },


  _d3_scaleExtent:function(domain) {
    var start = domain[0], stop = domain[domain.length - 1];
    return start < stop ? [start, stop] : [stop, start];
  },

  _d3_scaleRange:function(scale) {
    return scale.rangeExtent ? scale.rangeExtent() : this._d3_scaleExtent(scale.range());
  },

  render:function() {

    var props = this.props;
    var sign = props.orient === "top" || props.orient === "left" ? -1 : 1;

    var range = this._d3_scaleRange(props.scale);

    var d;

    if (props.orient === "bottom" || props.orient === "top") {
      d = "M" + range[0] + "," + sign * props.outerTickSize + "V0H" + range[1] + "V" + sign * props.outerTickSize;
    } else {
      d = "M" + sign * props.outerTickSize + "," + range[0] + "H0V" + range[1] + "H" + sign * props.outerTickSize;
    }


    return (
      React.createElement("path", {
        className: "domain", 
        d: d, 
        style: {'shapeRendering':'crispEdges'}, 
        fill: "none", 
        stroke: props.stroke, 
        strokeWidth: props.strokeWidth
      }
      )
    );
  }
});



},{}],7:[function(require,module,exports){
'use strict';

var React = (window.React);
var d3 = (window.d3);

module.exports = React.createClass({displayName: "exports",
  getDefaultProps:function() {
    return {
      innerTickSize: 6,
      outerTickSize: 6,
      tickPadding: 3,
      tickArguments: [10],
      tickValues: null
    };
  },

  render:function() {
    var props = this.props;

    var tr,
        ticks,
        scale,
        adjustedScale,
        textAnchor,
        tickFormat,
        y1, y2, dy, x1, x2, dx;

    var sign = props.yScale ? -1 : 1;
    var tickSpacing = Math.max(props.innerTickSize, 0) + props.tickPadding;  

    scale = props.yScale ? props.yScale : props.xScale;

    ticks = props.tickValues == null ? (scale.ticks ? scale.ticks.apply(scale, props.tickArguments) : scale.domain()) : props.tickValues;
    if (props.tickFormatting) {
        tickFormat = props.tickFormatting
    } else if (scale.tickFormat) {
        tickFormat = scale.tickFormat.apply(scale, props.tickArguments)
    } else {
        tickFormat = function(d) {return d;};

    }

    adjustedScale = scale.rangeBand ? function(d)  { return scale(d) + scale.rangeBand() / 2; } : scale;

    // Still working on this
    // Ticks and lines are not fully aligned
    // in some orientations
    switch (props.orient) {
      case 'top':
        tr = function(tick)  {return ("translate(" + adjustedScale(tick) + ",0)");};
        textAnchor = "middle";
        y2 = props.innerTickSize * sign;
        y1 = tickSpacing * sign;
        dy =  sign < 0 ? "0em" : ".71em";
        break;
      case 'bottom':
        tr = function(tick)  {return ("translate(" + adjustedScale(tick) + ",0)");};
        textAnchor = "middle";
        y2 = props.innerTickSize * sign;
        y1 = tickSpacing * sign;
        dy =  sign < 0 ? "0em" : ".71em";
        break;
      case 'left':
        tr = function(tick)  {return ("translate(0," + adjustedScale(tick) + ")");};
        textAnchor = "end";
        x2 = props.innerTickSize * sign;
        x1 = tickSpacing * sign;
        dy = ".32em";
        break;
      case 'right':
        tr = function(tick)  {return ("translate(0," + adjustedScale(tick) + ")");};
        textAnchor = "end";
        x2 = props.innerTickSize;
        x1 = tickSpacing * sign;
        dy = ".32em";
        break;
    }

    return (
      React.createElement("g", null, 
        ticks.map( function(tick, i)  {
          return (
            React.createElement("g", {key: i, className: "tick", transform: tr(tick)}, 
              React.createElement("line", {style: {shapeRendering:'crispEdges',opacity:'1',stroke:'#000'}, x2: x2, y2: y2}
              ), 
              React.createElement("text", {
                strokeWidth: "0.01", 
                dy: dy, x: x1, y: y1, 
                stroke: "#000", 
                textAnchor: textAnchor
              }, 
                tickFormat(tick)
              )
            )
          );
          })
        
      )
    );
  }

});



},{}],8:[function(require,module,exports){
'use strict';

var React = (window.React);


module.exports = React.createClass({displayName: "exports",

  render:function() {
    var props = this.props;
    var strokeWidth = '0.01';
    if (props.label) {
      switch (props.orient) {
        case 'top':
          return (
            React.createElement("text", {
              strokeWidth: strokeWidth, 
              y: props.offset, x: props.width/2, 
              textAnchor: "middle"}, 
              props.label
            )
          );
        case 'bottom':
          return (
            React.createElement("text", {
              strokeWidth: strokeWidth, 
              y: props.offset, x: props.width/2, 
              textAnchor: "middle"}, 
              props.label
            )
          );
        case 'left':
          return (
            React.createElement("text", {
              strokeWidth: strokeWidth, 
              y: -props.offset, x: -props.height/2, 
              textAnchor: "middle", 
              transform: "rotate(270)"}, 
              props.label
            )
          );
        case 'right':
          return (
            React.createElement("text", {
              strokeWidth: strokeWidth, 
              y: props.offset, x: -props.height/2, 
              textAnchor: "middle", 
              transform: "rotate(270)"}, 
              props.label
            )
          );
      }
    }
    return React.createElement("text", null);
  }

});





},{}],9:[function(require,module,exports){
'use strict';

var React = (window.React);
var d3 = (window.d3);
var AxisTicks = require('./AxisTicks');
var AxisLine = require('./AxisLine');
var Label = require('./Label');

module.exports = React.createClass({displayName: "exports",

  propTypes: {
    xAxisClassName: React.PropTypes.string.isRequired,
    xOrient: React.PropTypes.oneOf(['top', 'bottom']),
    xScale: React.PropTypes.func.isRequired,
    height: React.PropTypes.number.isRequired,
    fill: React.PropTypes.string,
    stroke: React.PropTypes.string,
    tickStroke: React.PropTypes.string,
    strokeWidth: React.PropTypes.string,
    xAxisOffset: React.PropTypes.number
  },

  getDefaultProps:function() {
    return {
      xAxisClassName: 'x axis',
      xAxisLabelOffset: 10,
      xOrient: 'bottom',
      fill: 'none',
      stroke: 'none',
      tickStroke: '#000',
      strokeWidth: 'none',
      xAxisOffset: 0,
      label: ''
    };
  },

  render:function() {
    var props = this.props;

    var t = ("translate(0," + (props.xAxisOffset + props.height) + ")");

    var tickArguments;
    if (typeof props.xAxisTickCount !== 'undefined') {
      tickArguments = [props.xAxisTickCount];
    }
    
    if (typeof props.xAxisTickInterval !== 'undefined') {
      tickArguments = [d3.time[props.xAxisTickInterval.unit], props.xAxisTickInterval.interval];
    }

    return (
      React.createElement("g", {
        className: props.xAxisClassName, 
        transform: t
      }, 
        React.createElement(Label, {
          label: props.xAxisLabel, 
          offset: props.xAxisLabelOffset, 
          orient: props.xOrient, 
          margins: props.margins, 
          width: props.width}
        ), 
        React.createElement(AxisTicks, {
          tickFormatting: props.tickFormatting, 
          tickArguments: tickArguments, 
          xScale: props.xScale, 
          orient: props.xOrient}
        ), 
        React.createElement(AxisLine, React.__spread({
          scale: props.xScale, 
          orient: props.xOrient}, 
          props)
        )
      )
    );
  }

});



},{"./AxisLine":6,"./AxisTicks":7,"./Label":8}],10:[function(require,module,exports){
'use strict';

var React = (window.React);
var d3 = (window.d3);
var AxisTicks = require('./AxisTicks');
var AxisLine = require('./AxisLine');

module.exports = React.createClass({displayName: "exports",

  propTypes: {
    yAxisClassName: React.PropTypes.string,
    yOrient: React.PropTypes.oneOf(['left', 'right']),
    yScale: React.PropTypes.func.isRequired,
    fill: React.PropTypes.string,
    stroke: React.PropTypes.string,
    tickStroke: React.PropTypes.string,
    strokeWidth: React.PropTypes.string,
    yAxisOffset: React.PropTypes.number
  },

  getDefaultProps:function() {
    return {
      yAxisClassName: 'y axis',
      yOrient: 'left',
      fill: 'none',
      stroke: '#000',
      tickStroke: '#000',
      strokeWidth: '1',
      yAxisOffset: 0
    };
  },

  render:function() {

    var props = this.props;

    var t;
    if (props.yOrient === 'right') {
       t = ("translate(" + (props.yAxisOffset + props.width) + ",0)");
    } else {
       t = ("translate(" + props.yAxisOffset + ",0)");
    }

    var tickArguments;
    if (props.yAxisTickCount) {
      tickArguments = [props.yAxisTickCount];
    }
    
    if (props.yAxisTickInterval) {
      tickArguments = [d3.time[props.yAxisTickInterval.unit], props.yAxisTickInterval.interval];
    }

    return (
      React.createElement("g", {
        className: props.yAxisClassName, 
        transform: t
      }, 
        React.createElement(AxisTicks, {
          tickFormatting: props.tickFormatting, 
          tickArguments: tickArguments, 
          yScale: props.yScale, 
          orient: props.yOrient, 
          height: props.height, 
          width: props.width}
        ), 
        React.createElement(AxisLine, React.__spread({
          scale: props.yScale, 
          orient: props.yOrient}, 
          props)
        )
      )
    );
  }

});



},{"./AxisLine":6,"./AxisTicks":7}],11:[function(require,module,exports){

exports.XAxis = require('./XAxis');
exports.YAxis = require('./YAxis');



},{"./XAxis":9,"./YAxis":10}],12:[function(require,module,exports){
'use strict';

var React = (window.React);

module.exports = React.createClass({displayName: "exports",
  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement("svg", {
          viewBox: this.props.viewBox, 
          width: this.props.width, 
          height: this.props.height
        }, this.props.children)
      )
    );
  }
});



},{}],13:[function(require,module,exports){
'use strict';

var React = (window.React);
var LegendChart = require('./LegendChart');
var BasicChart = require('./BasicChart');

module.exports = React.createClass({displayName: "exports",

  propTypes: {
    legend: React.PropTypes.bool,
    viewBox: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      legend: false
    };
  },

  render: function() {
    if (this.props.legend) {
      return React.createElement(LegendChart, React.__spread({},  this.props));
    }
    return React.createElement(BasicChart, React.__spread({},  this.props));
  }

});




},{"./BasicChart":12,"./LegendChart":14}],14:[function(require,module,exports){
'use strict';

var React = (window.React);
var Legend = require('../Legend');

module.exports = React.createClass({displayName: "exports",

  propTypes: {
    legend: React.PropTypes.bool,
    legendPosition: React.PropTypes.string,
    sideOffset: React.PropTypes.number,
    margins: React.PropTypes.object,
    data: React.PropTypes.oneOfType([
      React.PropTypes.object,
      React.PropTypes.array
    ])
  },

  getDefaultProps:function() {
    return {
      data: {},
      legend: false,
      legendPosition: 'right',
      sideOffset: 90
    };
  },

  _renderLegend:function() {
    if (this.props.legend) {
      return (
        React.createElement(Legend, {
          legendPosition: this.props.legendPosition, 
          margins: this.props.margins, 
          colors: this.props.colors, 
          data: this.props.data, 
          width: this.props.width, 
          height: this.props.height, 
          sideOffset: this.props.sideOffset}
        ) 
      );
    }
  },

  render:function() {
    return (
      React.createElement("div", {style: {'width': this.props.width, 'height': this.props.height}}, 
        React.createElement("h4", null, this.props.title), 
        this._renderLegend(), 
        React.createElement("svg", {viewBox: this.props.viewBox, width: this.props.width - this.props.sideOffset, height: this.props.height}, this.props.children)
      )
    );
  }
});



},{"../Legend":5}],15:[function(require,module,exports){

exports.BasicChart = require('./BasicChart');
exports.Chart = require('./Chart');
exports.LegendChart = require('./LegendChart');



},{"./BasicChart":12,"./Chart":13,"./LegendChart":14}],16:[function(require,module,exports){
exports.XAxis = require('./axes').XAxis;
exports.YAxis = require('./axes').YAxis;
exports.Chart = require('./charts').Chart;
exports.LegendChart = require('./charts').LegendChart;
exports.Legend = require('./Legend');



},{"./Legend":5,"./axes":11,"./charts":15}],17:[function(require,module,exports){
'use strict';

var React = (window.React);
var d3 = (window.d3);

module.exports =  {

  propTypes: {
    axesColor: React.PropTypes.string,
    colors: React.PropTypes.func,
    data: React.PropTypes.oneOfType([
      React.PropTypes.array,
      React.PropTypes.object
    ]).isRequired,
    xOrient: React.PropTypes.oneOf(['top', 'bottom']),
    yOrient: React.PropTypes.oneOf(['left', 'right']),
    yAxisTickCount: React.PropTypes.number,
    yAxisLabel: React.PropTypes.string,
    yAxisLabelOffset: React.PropTypes.number,
    yAxisFormatter: React.PropTypes.func,
    xAxisTickInterval: React.PropTypes.object,
    xAxisLabel: React.PropTypes.string,
    xAxisLabelOffset: React.PropTypes.number,
    xAxisFormatter: React.PropTypes.func,
    legend: React.PropTypes.bool,
    legendOffset: React.PropTypes.number,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    xAccessor: React.PropTypes.func,
    yAccessor: React.PropTypes.func,
    title: React.PropTypes.string,
    viewBox: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      data: [],
      xOrient: 'bottom',
      xAxisLabel: '',
      xAxisLabelOffset: 38,
      yOrient: 'left',
      yAxisLabel: '',
      yAxisLabelOffset: 35,
      legend: false,
      legendOffset: 120,
      width: 400,
      height: 200,
      axesColor: '#000',
      title: '',
      colors: d3.scale.category20c(),
      xAccessor: function(d)  {return d.x;},
      yAccessor: function(d)  {return d.y;}
    };
  }

};



},{}],18:[function(require,module,exports){

exports.CartesianChartPropsMixin = require('./CartesianChartPropsMixin');



},{"./CartesianChartPropsMixin":17}],19:[function(require,module,exports){
var d3 = (window.d3);


exports.calculateScales = function(chartWidth, chartHeight, xValues, yValues)  {

  var xScale, yScale;

  if (xValues.length > 0 && Object.prototype.toString.call(xValues[0]) === '[object Date]') {
    xScale = d3.time.scale()
      .range([0, chartWidth]);
  } else {
    xScale = d3.scale.linear()
      .range([0, chartWidth]);
  }
  xScale.domain(d3.extent(xValues));

  if (yValues.length > 0 && Object.prototype.toString.call(yValues[0]) === '[object Date]') {
    yScale = d3.time.scale()
      .range([chartHeight, 0]);
  } else {
    yScale = d3.scale.linear()
      .range([chartHeight, 0]);
  }

  yScale.domain(d3.extent(yValues));

  return {
    xScale: xScale,
    yScale: yScale
  };

};

// debounce from Underscore.js
// MIT License: https://raw.githubusercontent.com/jashkenas/underscore/master/LICENSE
// Copyright (c) 2009-2014 Jeremy Ashkenas, DocumentCloud and Investigative
// Reporters & Editors
exports.debounce = function(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

exports.flattenData = function(data, xAccessor, yAccessor)  {

  var allValues = [];
  var xValues = [];
  var yValues = [];
  var coincidentCoordinateCheck = {};

  data.forEach( function(series)  {
    series.values.forEach( function(item, idx)  {

      var x = xAccessor(item);

      // Check for NaN since d3's Voronoi cannot handle NaN values
      // Go ahead and Proceed to next iteration since we don't want NaN
      // in allValues or in xValues or yValues
      if (isNaN(x)) {
        return;
      }
      xValues.push(x);

      var y = yAccessor(item);
      // when yAccessor returns an object (as in the case of candlestick)
      // iterate over the keys and push all the values to yValues array
      var yNode;
      if (typeof y === 'object' && Object.keys(y).length > 0) {
        Object.keys(y).forEach(function (key) {
          // Check for NaN since d3's Voronoi cannot handle NaN values
          // Go ahead and Proceed to next iteration since we don't want NaN
          // in allValues or in xValues or yValues
          if (isNaN(y[key])) {
            return;
          }
          yValues.push(y[key]);
          // if multiple y points are to be plotted for a single x
          // as in the case of candlestick, default to y value of 0
          yNode = 0;
        });
      } else {
        // Check for NaN since d3's Voronoi cannot handle NaN values
        // Go ahead and Proceed to next iteration since we don't want NaN
        // in allValues or in xValues or yValues
        if (isNaN(y)) {
          return;
        }
        yValues.push(y);
        yNode = y;
      }

      var xyCoords = ( x + "-" +  yNode);
      if (xyCoords in coincidentCoordinateCheck) {
        // Proceed to next iteration if the x y pair already exists
        // d3's Voronoi cannot handle NaN values or coincident coords
        // But we push them into xValues and yValues above because
        // we still may handle them there (labels, etc.)
        return;
      }
      coincidentCoordinateCheck[xyCoords] = '';
      var pointItem = {
        coord: {
          x: x,
          y: yNode,
        },
        id: ( series.name + "-" +  idx)
      };
      allValues.push(pointItem);
    });
  });

  return {
    allValues: allValues,
    xValues: xValues,
    yValues: yValues
  };
};


exports.shade = function(hex, percent)  {

  var R, G, B, red, green, blue, number;
  var min = Math.min, round = Math.round;
  if(hex.length !== 7) { return hex; }
  number = parseInt(hex.slice(1), 16);
  R = number >> 16;
  G = number >> 8 & 0xFF;
  B = number & 0xFF;
  red = min( 255, round( ( 1 + percent ) * R )).toString(16);
  green = min( 255, round( ( 1 + percent ) * G )).toString(16);
  blue = min( 255, round( ( 1 + percent ) * B )).toString(16);
  return ("#" +  red +  green +  blue);

};



},{}]},{},[1])(1)
});
//# sourceMappingURL=react-d3.js.map