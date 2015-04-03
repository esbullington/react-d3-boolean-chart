'use strict';

var expect = require('chai').expect;
var _ = require('lodash');

describe('BooleanChart', function() {
  it('renders booleanchart property with object data', function() {
    var React = require('react/addons');
    var BooleanChart = require('../src/booleanchart').BooleanChart;
    var generate = require('../utils/datagen').generateArrayOfDataPointObjects;
    var TestUtils = React.addons.TestUtils;

    // Render a booleanchart using array data
    var data = {
      name: 'a series',
      values: generate(20)
    };

    var booleanchart = TestUtils.renderIntoDocument(
      <BooleanChart data={data} width={400} height={200} />
    );

    var booleanchartGroup = TestUtils.findRenderedDOMComponentWithClass(
      booleanchart, 'rd3-booleanchart');
    expect(booleanchartGroup).to.exist;
    expect(booleanchartGroup.tagName).to.equal('G');

    var axis = TestUtils.scryRenderedDOMComponentsWithClass(
      booleanchart, 'rd3-booleanchart-axis');
    expect(axis).to.exist;

  });
  it('renders multi-series booleanchart with array of objects data', function() {

    var React = require('react/addons');
    var BooleanChart = require('../src/booleanchart').BooleanChart;
    var generate = require('../utils/datagen').generateArrayOfDataPointObjects;
    var TestUtils = React.addons.TestUtils;
    var length = 20;

    var dataPointObjects = generate(length);
    var result = _.groupBy(dataPointObjects, 'datapointId');

    // Render a booleanchart using array data
    var data = Object.keys(result).map( (datapointId, idx) => {
      return {
        name: datapointId,
        values: result[datapointId]
      }
    });

    var booleanchart = TestUtils.renderIntoDocument(
      <BooleanChart data={data} width={400} height={200} />
    );

    // Verify that it has the same number of stacked charts as the array's length
    var chartGroups = TestUtils.scryRenderedDOMComponentsWithClass(
      booleanchart, 'rd3-booleanchart');
    expect(chartGroups).to.have.length(data.length);

  });
});
