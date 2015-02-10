/** @jsx React.DOM */
var HelloComponent = React.createClass({
    propTypes: {
        fname : React.PropTypes.string.isRequired,
        lname : React.PropTypes.string.isRequired
    },
    render: function() {
            return (<div>
                <h1>This is the HELLOOOO </h1>
            </div>

                )


    }
});

AppMain.value('HelloComponent', HelloComponent);
