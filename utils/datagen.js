
exports.generateArrayOfPoints = function(n) {
  var data = [];
  for (var i = 0; i < n; i++) {
    var x = i;
    var y = Math.random() * 100;
    var point = {x: x, y:y};
    data.push(point);
  } 
  return data;
};

exports.generateArrayOfNumbers = function(n) {
  var data = [];
  for (var i = 0; i < n; i++) {
    var j = Math.floor(Math.random() * 100);
    data.push(j);
  } 
  return data;
};

exports.generateArrayOfTimeObjects = function(n) {
  function randomDate(start, end) {
      return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }

  randomDate(new Date(2000, 0, 1), new Date())
  var data = [];
  for (var i = 0; i < n; i++) {
    var date = randomDate(new Date(2012, 0, 1), new Date());
    var value = Math.random() * 1000;
    var point = {date:date.valueOf(), value:value};
    data.push(point);
  } 
  return data.sort(function(a, b) {
    return a.date - b.date;
  });
};

exports.generateArrayOfDataPointObjects = function(n) {
  // {"id":"MDAwMTg2YTEwMDAxMjRmYTU0ZjU1Y2U0MzcyZmI3NTAwMDAzAA==„,
  var dataPoints = [75000, 75005, 75010];

  function randomDate(start, end) {
      return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }

  randomDate(new Date(2000, 0, 1), new Date())
  var data = [];
  var date = new Date();
  for (var i = 0; i < n; i++) {
    var timeStamp = randomDate(new Date(), new Date(date.getTime() + 60000));
    var value = Math.random()<.5;
    var datapointId = dataPoints[Math.floor(Math.random() * dataPoints.length)];
    var point = {"id":"id-" + i, "timeStamp": timeStamp, "stationId":100001, "datapointId": datapointId,"value":value}
    data.push(point);
  } 
  return data.sort(function(a, b) {
    return a.timeStamp - b.timeStamp;
  });
};


exports.generateArrayOfObjects = function(n) {
  var data = [];
  for (var i = 0; i < n; i++) {
    var x = Math.random() * 100;
    var y = Math.random() * 1000;
    var point = {x:x, y:y};
    data.push(point);
  } 
  return data;
};
