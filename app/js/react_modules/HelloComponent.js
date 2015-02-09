/** @jsx React.DOM */
var HelloComponent = React.createClass({
    propTypes: {
        fname : React.PropTypes.string.isRequired,
        lname : React.PropTypes.string.isRequired
    },
    render: function() {
        return <p>Hello {this.props.fname} {this.props.lname}</p>;
    }
});

AppMain.value('HelloComponent', HelloComponent);
