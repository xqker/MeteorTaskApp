
Header = React.createClass({
    mixins:[ReactMeteorData],
    getMeteorData(){
        return{
            currentUser: Meteor.user(),
            locations: Locations.find({}, {sort: {text: -1}}).fetch()
        }
    },
    handleLogout(){
        Meteor.logout();
        FlowRouter.go('Home');
    },
    render(){
        let loginButton, usrProfileButton, registerButton;
        let{ currentUser } = this.data;
        if(currentUser){
            var userEmail = currentUser.emails ? currentUser.emails[0].address : '';
            usrProfileButton = (
                <li><a href="/editProfile"> {userEmail} </a></li>
            );
            loginButton = (
                <li><a href="#" onClick={ this.handleLogout }>Logout</a></li>
            )
        } else {
            loginButton = (
                    <li><a href="/login">Login</a></li>
            );
            registerButton = (
                <li><a href="/registration">Registration</a></li>
            );
        }

        return (
            <nav className="navbar navbar-default">
            <div className="container">
                <div className="navbar-header">
                    <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                        <span className="sr-only">Toggle navigation</span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                    </button>
                    <a className="navbar-brand" href="/">Message Broadcaster</a>
                </div>

                <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                    <ul className="nav navbar-nav navbar-right">
                        <li><a href="/">Home</a></li>
                        { usrProfileButton }
                        { loginButton }
                        { registerButton }
                    </ul>
                </div>
            </div>
        </nav>
        )
    }
});