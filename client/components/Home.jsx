Messages = new Mongo.Collection("messages");
Meteor.subscribe("messages");

Home = React.createClass({
    mixins:[ReactMeteorData],

    handleSubmit(e){
        e.preventDefault();
        if(!this.data.userLocation)
            Meteor.Error('To post message you must to choose your location');
        var text = e.target.textInput.value;
        Meteor.call("addNewMessage",text);
        e.target.textInput.value="";
    },

    renderMessaged() {
        return this.data.messages.map((message) => {
            return (
                <Message key={ message._id } message={ message } />
            );
        });
    },

    getMeteorData(){
        var userLocation;
        if(Meteor.user())
            userLocation = Meteor.user().profile ? Meteor.user().profile.location : '';
        return {
            messages: Messages.find({location: userLocation}, {sort: {createdAt: -1}}).fetch(),
            currentUser: Meteor.user(),
            userLocation: userLocation
        }
    },

    render(){
        return (

                <div className="container">
                    {
                        this.data.currentUser ?
                        <div>
                            <form className="form-group" onSubmit={this.handleSubmit} >
                                <input
                                    className="form-control"
                                    type="text"
                                    name="textInput"
                                    placeholder="Type to broadcast new message" />
                                <input type="submit" value="Send" className="btn btn-default"/>
                            </form>
                            <div className="list-group" >
                                 { this.renderMessaged() }
                            </div>
                        </div>
                            : <h3 className="text-center">If you want to use Message broadcaster, you need to login</h3>
                        }

                </div>
        )
    }
});