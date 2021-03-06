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

  displayName: 'BooleanChart',

  mixins: [ CartesianChartPropsMixin ],

  propTypes: {
    dottedLine: React.PropTypes.bool,
    lineWidth: React.PropTypes.string,
    lineColor: React.PropTypes.string,
    margins: React.PropTypes.object,
    stackedChartMargins: React.PropTypes.object,
    stackedChartHeight: React.PropTypes.number,
    colors: React.PropTypes.func,
    booleanLabels: React.PropTypes.object,
    stackedChartLabel: React.PropTypes.bool
  },

  getDefaultProps() {
    return {
      dottedLine: true,
      lineWidth: "1",
      lineColor: "black",
      margins: {top: 10, right: 20, bottom: 40, left: 45},
      stackedChartMargins: {top: 20, right: 20, bottom: 20, left: 45},
      className: 'rd3-booleanchart',
      stackedChartLabel: false,
      booleanLabels: {on: 'on', off: 'off'}
    };
  },

  render() {

    var props = this.props;

    var data;

    if (!Array.isArray(props.data)) {
      data = [props.data];
    } else {
      data = props.data;
    }

    var numberItems = props.data.length;

    var chartHeight = props.height / numberItems;

    var stackedChartHeight = props.stackedChartHeight || chartHeight;

    // Calculate inner stacked chart dimensions
    var innerWidth, innerHeight;
    innerWidth = props.width - props.margins.left - props.margins.right;
    innerHeight = props.height - props.margins.top - props.margins.bottom;

    var stackedChartInnerHeight;
    stackedChartInnerHeight = stackedChartHeight - props.stackedChartMargins.top - props.stackedChartMargins.bottom;

    if (props.legend) {
      innerWidth = innerWidth - props.legendOffset;
    }

    var flattenedData = utils.flattenData(data, props.xAccessor, props.yAccessor);

    var allValues = flattenedData.allValues,
        xValues = flattenedData.xValues,
        yValues = flattenedData.yValues;

    var scales = utils.calculateScales(innerWidth, innerHeight, xValues, yValues);

    var trans = `translate(${ props.margins.left },${ props.stackedChartMargins.top })`;

    var yScale = d3.scale.ordinal()
      .domain([true, false])
      .rangeBands([0, props.stackedChartInnerHeight/2]);

    var charts = data.map( (series, idx) => {
          return (
            <svg
              key={idx}
              y={idx * (stackedChartHeight)}
              width={props.width}
              height={ props.stackedChartInnerHeight }
            >
              <g transform={trans} className={props.className}>
              { 
                // If it's the last series, we display the x axis
                // otherwise, it's a dotted line
                idx === data.length - 1 ? <XAxis
                  xAxisClassName='rd3-booleanchart-xaxis'
                  tickFormatting={props.xAxisFormatter}
                  xAxisLabel={props.xAxisLabel}
                  xAxisLabelOffset={props.xAxisLabelOffset}
                  xAxisTickCount={props.xAxisTickCount}
                  xOrient={props.xOrient}
                  xScale={scales.xScale}
                  width={innerWidth}
                  height={stackedChartInnerHeight}
                  stroke={props.axesColor}
                  strokeWidth={props.strokeWidth}/>
                : <line 
                    strokeWidth={props.lineWidth}
                    stroke={props.lineColor}
                    strokeDasharray={props.dottedLine ? "5, 4" : "5, 0"}
                    x1="0" y1={stackedChartInnerHeight} x2={innerWidth} y2={stackedChartInnerHeight} />
              }
                <StackedChart
                  xScale={scales.xScale}
                  yScale={yScale}
                  seriesName={series.name}
                  data={series.values}
                  fill={props.colors(idx)}
                  key={series.name}
                  xAccessor={props.xAccessor}
                  yAccessor={props.yAccessor}
                  booleanLabels={series.booleanLabels ? series.booleanLabels : props.booleanLabels}
                  stackedChartIndex={idx}
                  stackedChartTop={idx * (stackedChartInnerHeight)}
                  stackedChartInnerHeight={stackedChartInnerHeight}
                  stackedChartLabel={props.stackedChartLabel}
                />
              </g>
            </svg>
        )
    });
    return <Chart
            viewBox={props.viewBox}
            legend={props.legend}
            data={data}
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
