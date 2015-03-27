'use strict';

var React = require('react');

module.exports = React.createClass({
  render: function() {
    return (
      <div>
        <svg
          viewBox={this.props.viewBox}
          width={this.props.width}
          height={this.props.height}
        >{this.props.children}</svg>
      </div>
    );
  }
});
