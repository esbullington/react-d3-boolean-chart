## Boolean-Chart

Provides a chart to reflect the state of a boolean variable over time.  Stacked series are supported.

### Installation

`npm install react-d3-boolean-chart`

### Usage

`var BooleanChart = require('react-d3'boolean'chart').BooleanChart`

Please see online [example documentation](https://github.com/esbullington/react-d3-boolean-chart/build/public/) for usage example.

### Properties

Special `BooleanChart` properties that can be passed in:

* `dottedLine` (bool): Whether the lines between stacked charts should be dotted (true) or solid (false)
* `lineWidth` (string): Width of lines between stacked charts (defaults to 1)
* `lineColor` (string): Fill color of lines between stacked chart (defaults to black)
* `margins` (object): Same as react-d3, object containing {top: , bottom: , left: , right: } margins
* `stackedChartMargins` (object): Like chart margins, but for stacked charts
* `stackedChartHeight` (number): Normally, stackedChartHeight is determined automatically by dividing chart height by number of series, but with `stackedChartHeight`, this height can be forced to a given height
* `colors` (func): Like react-d3, takes a function that returns color for series based on series index
* `booleanLabels` (object): Takes object to customize on/off labels. Ex: {on: 'hot', off: 'cold'}.  A different boolean label can also be based in to the data array for each series.
* `stackedChartLabel` (bool): Whether or not to display the series name at the top of each stacked chart.

### Sponsorship

This chart was conceived and sponsored by the [engineering firm](http://www.jbysewski.de/) of Jakob Bysewski, Saarlouis, Germany.

### License

MIT
