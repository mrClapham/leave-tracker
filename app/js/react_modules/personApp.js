/*** @jsx React.DOM */

var PersonApp = React.createClass({displayName: "PersonApp",
    getInitialState:function(){
        return {data:[]}
    },
    componentWillMount:function(){

    },
    render:function(){
        return(React.createElement("div", null, 
            React.createElement("h1", null, "This is the PersonApp")
        )

            )
    }
})

