Locations = new Mongo.Collection("locations");
Meteor.subscribe("locations");

UserLocation = React.createClass({
    mixins:[ReactMeteorData],

    getMeteorData(){
        return {
            locations: Locations.find({}, {sort: {text: -1}}).fetch()
        }
    },
    renderLocations(){
        return this.data.locations.map((userLocation) =>{
            return <option key={userLocation._id} value={userLocation.text}>{userLocation.text}</option>
        })
    },
    render(){
        return(
            <select className="form-control" name="userLocation" id="sel1" defaultValue={this.props.value}>
                {this.renderLocations()}
            </select>
        )
    }
});