'use strict';

var React = require('react');
var d3 = require('d3');
var common = require('../common');
var Chart = common.Chart;
var XAxis = common.XAxis;
var YAxis = common.YAxis;
var utils = require('../utils');
var StackedChart = require('./StackedChart');
var mixins = require('../mixins');
var CartesianChartPropsMixin = mixins.CartesianChartPropsMixin;


module.exports = React.createClass({

  mixins: [ CartesianChartPropsMixin ],

  propTypes: {
    margins: React.PropTypes.object,
    stackedChartMargins: React.PropTypes.object,
    booleanLabels: React.PropTypes.array,
    pointRadius: React.PropTypes.number,
    colors: React.PropTypes.func,
    displayDataPoints: React.PropTypes.bool
  },

  getDefaultProps() {
    return {
      stackedChartHeight: 120,
      margins: {top: 10, right: 20, bottom: 40, left: 45},
      stackedChartMargins: {top: 10, right: 20, bottom: 40, left: 45},
      className: 'rd3-booleanchart',
      pointRadius: 3,
      interpolate: false,
      interpolationType: null,
      displayDataPoints: true
    };
  },

  render() {

    var props = this.props;

    if (!Array.isArray(props.data)) {
      props.data = [props.data];
    }

    var numberItems = props.data.length;

    var chartHeight = props.height / numberItems;

    var interpolationType = props.interpolationType || (props.interpolate ? 'cardinal' : 'linear');

    // Calculate inner stacked chart dimensions
    var innerWidth, innerHeight;

    innerWidth = props.width - props.margins.left - props.margins.right;
    innerHeight = props.stackedChartHeight - props.margins.top - props.margins.bottom;

    if (props.legend) {
      innerWidth = innerWidth - props.legendOffset;
    }

    var flattenedData = utils.flattenData(props.data, props.xAccessor, props.yAccessor);

    var allValues = flattenedData.allValues,
        xValues = flattenedData.xValues,
        yValues = flattenedData.yValues;

    var scales = utils.calculateScales(innerWidth, innerHeight, xValues, yValues);

    var trans = `translate(${ props.margins.left },${ props.margins.top })`;

    var yScale = d3.scale.ordinal()
      .domain([true, false])
      .rangeBands([0, props.stackedChartHeight/2]);

    var charts = props.data.map( (series, idx) => {
          return (
            <svg
              key={idx}
              y={idx * (props.stackedChartHeight + 110)}
              width={props.width}
              height={ props.stackedChartHeight }
            >
              <g transform={trans} className={props.className}>
                <XAxis
                  xAxisClassName='rd3-linechart-xaxis'
                  tickFormatting={props.xAxisFormatter}
                  xAxisLabel={props.xAxisLabel}
                  xAxisLabelOffset={props.xAxisLabelOffset}
                  xAxisTickCount={props.xAxisTickCount}
                  xOrient={props.xOrient}
                  xScale={scales.xScale}
                  width={innerWidth}
                  height={innerHeight}
                  stroke={props.axesColor}
                  strokeWidth={props.strokeWidth}
                />
                <StackedChart
                  xScale={scales.xScale}
                  yScale={yScale}
                  seriesName={series.name}
                  data={series.values}
                  fill={props.colors(idx)}
                  pointRadius={props.pointRadius}
                  key={series.name}
                  xAccessor={props.xAccessor}
                  yAccessor={props.yAccessor}
                  interpolationType={interpolationType}
                  displayDataPoints={props.displayDataPoints}
                  stackedChartIndex={idx}
                  stackedChartTop={idx * (innerHeight)}
                  stackedChartHeight={innerHeight}
                />
              </g>
            </svg>
        )
    });
    return <Chart
            viewBox={props.viewBox}
            legend={props.legend}
            data={props.data}
            margins={props.margins}
            colors={props.colors}
            width={props.width}
            height={props.height}
            title={props.title}
          >
          {charts}
          <text
            strokeWidth='0.01'
            y={10} x={-props.height/2}
            textAnchor='middle'
            transform='rotate(270)'>
            {props.yAxisLabel}
          </text>
          </Chart>;

  }

});
