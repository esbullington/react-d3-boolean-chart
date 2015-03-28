'use strict';

var React = require('react');
var d3 = require('d3');
var hljs = require("highlight.js");
var datagen = require('../../utils/datagen');
var rd3 = require('../../src');
var BinaryChart = rd3.BinaryChart;

hljs.initHighlightingOnLoad();

var Demos = React.createClass({


  render: function() {

    var dataPointObjects = datagen.generateArrayOfDataPointObjects(5);
    var binaryData = [
      {
        name: dataPointObjects[0].datapointId,
        values: dataPointObjects
      },
      {
        name: dataPointObjects[1].datapointId,
        values: dataPointObjects
      },
      {
        name: dataPointObjects[2].datapointId,
        values: dataPointObjects
      }
    ];

    console.log('dataPointObjects', dataPointObjects);

    return (
      <div className="container">
        <div className="row">
          <h3 className="page-header">binary-chart</h3>
        </div>
        <div className="row">
          <div className="col-md-6">
            <BinaryChart
              legend={true}
              data={binaryData}
              width={500}
              height={600}
              title="Line Chart"
              xAxisLabel="Time (sec)"
              xAccessor={ (point) => point.timeStamp }
              yAccessor={ (point) => point.value }
            />
          </div>
          <div className="col-md-6">
            <pre ref='block'>
              <code className='js'>
              {
`var binaryData = [
  {
    name: "series1",
    values: [ { x: 0, y: 20 }, ..., { x: 24, y: 10 } ]
  },
  ....
  {
    name: "series2",
    values: [ { x: 70, y: 82 }, ..., { x: 76, y: 82 } ]
  }
];`
              }
              </code>
            </pre>
            <pre ref='block'>
              <code className='html'>
              {
`<BinaryChart
  legend={true}
  data={binaryData}
  width={500}
  height={300}
  title="Line Chart"
  yAxisLabel="Altitude"
  xAxisLabel="Elapsed Time (sec)"
/>`
              }
              </code>
            </pre>
          </div>
        </div>

      </div>
    );
  }

});

React.render(
  <Demos />,
  document.body
);
