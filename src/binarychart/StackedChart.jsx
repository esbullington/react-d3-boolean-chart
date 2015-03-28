'use strict';

var React = require('react');
var d3 = require('d3');

module.exports = React.createClass({

  propTypes: {
    data: React.PropTypes.array,
    interpolationType: React.PropTypes.string,
    fill: React.PropTypes.string,
    xAccessor: React.PropTypes.func,
    yAccessor: React.PropTypes.func,
    displayDataPoints: React.PropTypes.bool
  },

  getDefaultProps() {
    return {
      data: [],
      interpolationType: 'linear',
      fill: '#fff',
      xAccessor: (d) => d.x,
      yAccessor: (d) => d.y,
      displayDataPoints: true,
      squareWaveOffsetDivisor: 4
    };
  },

  _isDate(d, accessor) {
    return Object.prototype.toString.call(accessor(d)) === '[object Date]';
  },

  renderVertical(isNotSameValue, linePoints) {
    if (isNotSameValue) {
      return <line
        stroke={this.props.fill}
        strokeWidth="2"
        x1={linePoints.x1}
        x2={linePoints.x2}
        y1={linePoints.y1}
        y2={linePoints.y2}
        />;
    }
    return <g/>;
  },

  render() {

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

      if (point.value) {
        y1 = squareWaveOffset;
        y2 = squareWaveOffset;
      } else {
        y1 = props.stackedChartHeight - squareWaveOffset;
        y2 = props.stackedChartHeight - squareWaveOffset;
      }

      var prevy2, prevy1;
      if (prevPoint.value) {
        prevy1 = squareWaveOffset;
        prevy2 = squareWaveOffset;
      } else {
        prevy1 = props.stackedChartHeight - squareWaveOffset;
        prevy2 = props.stackedChartHeight - squareWaveOffset;
      }
 
      var isNotSameValue = point.value !== nextPoint.value;

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
        <g key={i}>
        <line
          stroke={props.fill}
          strokeWidth="2"
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
        />
        {isNotSameValue ? <line
          stroke={props.fill}
          strokeWidth="2"
          x1={linePoints.x1}
          x2={linePoints.x2}
          y1={linePoints.y1}
          y2={linePoints.y2}
          /> : <g/>
        }
        </g>
      );
    }, this);

    return (
      <g>
        {lines}
        <text
          strokeWidth='0.01'
          textAnchor='middle'
          dy="0.25em"
          x={-25}
          y={props.stackedChartHeight - (props.stackedChartHeight/props.squareWaveOffsetDivisor)}
        >Off</text>
        <text
          dy="0.25em"
          strokeWidth='0.01'
          textAnchor='middle'
          x={-25}
          y={props.stackedChartHeight/props.squareWaveOffsetDivisor}
        >On</text>
      </g>
    );
  }

});
