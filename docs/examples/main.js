'use strict';

var React = require('react');
var d3 = require('d3');
var _ = require('lodash');
var hljs = require("highlight.js");
var datagen = require('../../utils/datagen');
var booleanchart = require('../../src');
var BooleanChart = booleanchart.BooleanChart;

hljs.initHighlightingOnLoad();

var Demos = React.createClass({


  render: function() {

    var dataPointObjects = datagen.generateArrayOfDataPointObjects(20);

    var result = _.groupBy(dataPointObjects, 'datapointId');

    var booleanData = Object.keys(result).map( (datapointId, idx) => {
      return {
        name: datapointId,
        values: result[datapointId]
      }
    });

    return (
      <div className="container">
        <div className="row">
          <h3 className="page-header">boolean-chart</h3>
        </div>
        <div className="row">
          <div className="col-md-6">
            <BooleanChart
              legend={true}
              data={booleanData}
              width={550}
              height={600}
              title="Boolean Chart"
              xAxisLabel="Time (sec)"
              xAxisTickCount={4}
              xAccessor={ (point) => point.timeStamp }
              yAccessor={ (point) => point.value }
            />
          </div>
          <div className="col-md-6">
            <pre ref='block'>
              <code className='js'>
              {
`var booleanData = [
  {
    name: "75000",
    values: [ {datapointId: 75000, id: "id-14", stationId: 100001, timeStamp: Sat Mar 28 2015 10:17:44 GMT-0400 (EDT), value: false }, ... ]
  },
  ....
  {
    name: "75005",
    values: [ { datapointId: 75005, id: "id-8", stationId: 100001, timeStamp: Sat Mar 28 2015 10:17:27 GMT-0400 (EDT), value: true }, ... ]
  }
];`
              }
              </code>
            </pre>
            <pre ref='block'>
              <code className='html'>
              {
`<BooleanChart
  legend={true}
  data={booleanData}
  width={550}
  height={600}
  title="Boolean Chart"
  xAxisLabel="Time (sec)"
  xAxisTickCount={4}
  xAccessor={ (point) => point.timeStamp }
  yAccessor={ (point) => point.value }
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
