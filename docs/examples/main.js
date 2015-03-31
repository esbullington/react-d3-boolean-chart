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
        <a href="https://github.com/esbullington/react-d3-boolean-chart">
          <img
            style={{position: "absolute", top: "0", right: "0", border: "0"}}
            src="https://camo.githubusercontent.com/a6677b08c955af8400f44c6298f40e7d19cc5b2d/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f677261795f3664366436642e706e67"
            alt="Fork me on GitHub"
            dataCanonicalSrc="https://s3.amazonaws.com/github/ribbons/forkme_right_gray_6d6d6d.png"/>
        </a>
        <div className="row">
          <h3 className="page-header">boolean-chart</h3>
        </div>
        <div className="row">
          <div className="col-md-6">
            <BooleanChart
              legend={true}
              data={booleanData}
              width={550}
              height={400}
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
  height={400}
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
