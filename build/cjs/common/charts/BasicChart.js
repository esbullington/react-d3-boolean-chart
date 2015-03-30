'use strict';

var React = require('react');

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
