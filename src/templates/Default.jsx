/**
 * The default template component for documentation in this repository.
 *
 * @author Tim Scanlin
 */

var React = require('react');
var ReactDOM = require('react-dom');

module.exports = React.createClass({
  propTypes: {
    // children: React.PropTypes.element.isRequired
  },

  render: function() {
    function wrapMarkup(html) {
      return { __html: html };
    }
    // console.log(this.props)
    return (
      <div data-test={this.props.title}>
        <div dangerouslySetInnerHTML={wrapMarkup(this.props.body)}></div>
      </div>
    );
  }
});
